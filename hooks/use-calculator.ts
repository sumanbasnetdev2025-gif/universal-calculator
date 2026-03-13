"use client";
import { useState, useCallback } from "react";

export function useCalculator<T>(initialState: T) {
  const [result, setResult] = useState<T | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    async (fn: () => T | Promise<T>) => {
      setIsCalculating(true);
      setError(null);
      try {
        const res = await fn();
        setResult(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Calculation error");
        setResult(null);
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isCalculating, error, calculate, reset };
}