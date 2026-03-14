"use client";
import { useState } from "react";
import { CalendarCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ExpiryResult {
  status: "fresh" | "expiring" | "expired";
  daysLeft: number;
  label: string;
  color: string;
  bgColor: string;
  icon: typeof CheckCircle;
  manufacturedAgo: string;
  totalShelfDays: number;
  percentUsed: number;
}

export default function ExpiryDate() {
  const [mfgDate,    setMfgDate]    = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [itemName,   setItemName]   = useState("");
  const [result,     setResult]     = useState<ExpiryResult | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [history,    setHistory]    = useState<(ExpiryResult & { name: string })[]>([]);

  const handleCheck = () => {
    setError(null);
    if (!expiryDate) return setError("Please enter the expiry date.");

    const today  = new Date();
    const expiry = new Date(expiryDate);
    const mfg    = mfgDate ? new Date(mfgDate) : null;

    if (isNaN(expiry.getTime())) return setError("Invalid expiry date.");
    if (mfg && isNaN(mfg.getTime())) return setError("Invalid manufacture date.");
    if (mfg && mfg > expiry) return setError("Manufacture date cannot be after expiry date.");

    const msPerDay  = 1000 * 60 * 60 * 24;
    const daysLeft  = Math.ceil((expiry.getTime() - today.getTime()) / msPerDay);
    const totalShelfDays = mfg
      ? Math.ceil((expiry.getTime() - mfg.getTime()) / msPerDay)
      : 0;
    const mfgDaysAgo = mfg
      ? Math.ceil((today.getTime() - mfg.getTime()) / msPerDay)
      : 0;
    const percentUsed = totalShelfDays > 0
      ? Math.min(100, (mfgDaysAgo / totalShelfDays) * 100)
      : 0;

    const manufacturedAgo = mfg
      ? `${mfgDaysAgo} days ago`
      : "N/A";

    let status: ExpiryResult["status"];
    let label: string;
    let color: string;
    let bgColor: string;
    let icon: typeof CheckCircle;

    if (daysLeft < 0) {
      status  = "expired";
      label   = `Expired ${Math.abs(daysLeft)} days ago`;
      color   = "text-red-500";
      bgColor = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      icon    = XCircle;
    } else if (daysLeft <= 30) {
      status  = "expiring";
      label   = `Expiring in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
      color   = "text-orange-500";
      bgColor = "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      icon    = AlertTriangle;
    } else {
      status  = "fresh";
      label   = `${daysLeft} days remaining`;
      color   = "text-green-500";
      bgColor = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      icon    = CheckCircle;
    }

    const res: ExpiryResult = {
      status, daysLeft, label, color, bgColor, icon,
      manufacturedAgo, totalShelfDays, percentUsed,
    };
    setResult(res);

    if (itemName) {
      setHistory((prev) => [
        { ...res, name: itemName },
        ...prev.filter((h) => h.name !== itemName).slice(0, 4),
      ]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Product Details</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Product / Item Name <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              placeholder="e.g. Milk, Medicine, Cosmetics"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Manufacture Date <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              type="date"
              value={mfgDate}
              onChange={(e) => setMfgDate(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Expiry / Best Before Date</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button
          onClick={handleCheck}
          className="w-full mt-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <CalendarCheck className="w-4 h-4 mr-2" />
          Check Expiry
        </Button>
      </div>

      {/* Result */}
      <div className={cn(
        "rounded-2xl border border-border/60 p-6",
        result ? result.bgColor : "bg-white dark:bg-white/5"
      )}>
        <h2 className="font-display text-lg font-semibold mb-4">Status</h2>

        {result ? (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-white/10 rounded-xl">
              <result.icon className={cn("w-10 h-10", result.color)} />
              <div>
                <p className={cn("font-display text-xl font-bold", result.color)}>
                  {result.label}
                </p>
                {itemName && (
                  <p className="text-sm text-muted-foreground">{itemName}</p>
                )}
              </div>
            </div>

            {/* Shelf life bar */}
            {result.totalShelfDays > 0 && (
              <div className="bg-white dark:bg-white/10 rounded-xl p-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Manufactured</span>
                  <span>{result.percentUsed.toFixed(0)}% shelf life used</span>
                  <span>Expires</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      result.status === "fresh"    ? "bg-green-500"  :
                      result.status === "expiring" ? "bg-orange-500" : "bg-red-500"
                    )}
                    style={{ width: `${result.percentUsed}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total shelf life: {result.totalShelfDays} days
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Manufactured</p>
                <p className="font-medium text-sm text-foreground">
                  {result.manufacturedAgo}
                </p>
              </div>
              <div className="bg-white dark:bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                <p className={cn("font-display text-2xl font-bold", result.color)}>
                  {result.daysLeft < 0 ? 0 : result.daysLeft}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                <CalendarCheck className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm text-muted-foreground">Enter dates to check expiry status</p>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
          <h3 className="font-display text-base font-semibold mb-4">Recent Checks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((h) => (
              <div key={h.name}
                className={cn("rounded-xl border p-3", h.bgColor)}>
                <div className="flex items-center gap-2 mb-1">
                  <h.icon className={cn("w-4 h-4", h.color)} />
                  <span className="text-sm font-semibold text-foreground">{h.name}</span>
                </div>
                <p className={cn("text-xs font-medium", h.color)}>{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}