
"use client";

import { cn } from "@/lib/utils";
import React from "react";
import type { LucideIcon } from "lucide-react";

interface CalcShellProps {
  icon:        LucideIcon;
  iconColor:   string;   
  iconBg:      string;   
  title:       string;
  description: string;
  tabs:        { key: string; label: string; icon?: React.ReactNode }[];
  activeTab:   string;
  onTab:       (key: string) => void;
  accentColor: string;  
  children:    React.ReactNode;
}

export function CalcShell({
  icon: Icon, iconColor, iconBg,
  title, description,
  tabs, activeTab, onTab, accentColor,
  children,
}: CalcShellProps) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", iconColor)} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border mb-6">
        <nav className="flex gap-0 overflow-x-auto scrollbar-none -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 sm:px-5 py-3 text-sm font-medium whitespace-nowrap",
                "border-b-2 transition-all",
                activeTab === tab.key
                  ? `border-current ${iconColor} font-semibold`
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {children}
    </div>
  );
}

// ── CalcGrid ──────────────────────────────────────────────────────────────────
// 2-col on desktop (form | result), stacked on mobile
export function CalcGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {children}
    </div>
  );
}

// ── CalcCard ──────────────────────────────────────────────────────────────────
// White card with title
interface CalcCardProps {
  title?:    string;
  children:  React.ReactNode;
  className?: string;
}

export function CalcCard({ title, children, className }: CalcCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 sm:p-6",
      className
    )}>
      {title && (
        <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ── ResultPanel ───────────────────────────────────────────────────────────────
// Right column result area — shows empty state or result content
interface ResultPanelProps {
  icon:          LucideIcon;
  iconColor:     string;
  iconBg:        string;
  emptyText:     string;
  hasResult:     boolean;
  children?:     React.ReactNode;
  accentGradient?:string;
}

export function ResultPanel({
  icon: Icon, iconColor, iconBg,
  emptyText, hasResult, children, accentGradient,
}: ResultPanelProps) {
  if (!hasResult) {
    return (
      <div className={cn(
        "bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border/60",
        "flex flex-col items-center justify-center p-8 min-h-[200px] lg:min-h-0"
      )}>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3", iconBg)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <p className="text-sm text-muted-foreground text-center">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border border-border/60 overflow-hidden",
      accentGradient ? accentGradient : "bg-white dark:bg-white/5"
    )}>
      {children}
    </div>
  );
}

// ── FieldRow ──────────────────────────────────────────────────────────────────
export function FieldRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

// ── FieldLabel ────────────────────────────────────────────────────────────────
export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

// ── CalcButton ────────────────────────────────────────────────────────────────
interface CalcButtonProps {
  onClick:    () => void;
  children:   React.ReactNode;
  color:      string; // tailwind gradient classes
  className?: string;
  icon?:      React.ReactNode;
}

export function CalcButton({ onClick, children, color, className, icon }: CalcButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-3 px-6 rounded-xl font-semibold text-white text-sm",
        "flex items-center justify-center gap-2",
        "transition-all hover:opacity-90 active:scale-[0.98]",
        color, className
      )}
    >
      {icon}
      {children}
    </button>
  );
}

// ── ErrorMsg ──────────────────────────────────────────────────────────────────
export function ErrorMsg({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2 flex items-center gap-2">
      <span>⚠</span> {message}
    </p>
  );
}

// ── ResultRow ─────────────────────────────────────────────────────────────────
interface ResultRowProps {
  label:      string;
  value:      string;
  highlight?: boolean;
  accent?:    string;
}

export function ResultRow({ label, value, highlight, accent }: ResultRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-2.5 px-4 rounded-xl",
      highlight ? (accent ?? "bg-orange-500") + " text-white" : "bg-secondary/50 dark:bg-white/5"
    )}>
      <span className={cn("text-sm", highlight ? "text-white/90" : "text-muted-foreground")}>
        {label}
      </span>
      <span className={cn("font-mono font-bold text-sm sm:text-base", highlight ? "text-white" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

// ── BigResult ─────────────────────────────────────────────────────────────────
interface BigResultProps {
  label:     string;
  value:     string;
  sub?:      string;
  gradient:  string;
}

export function BigResult({ label, value, sub, gradient }: BigResultProps) {
  return (
    <div className={cn("p-5 sm:p-6 text-center text-white", gradient)}>
      <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
      <p className="font-display text-3xl sm:text-4xl font-bold break-all">{value}</p>
      {sub && <p className="text-sm opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

// ── InfoTable ─────────────────────────────────────────────────────────────────
interface InfoTableProps {
  title:  string;
  icon?:  string;
  rows:   { label: string; value: string }[];
}

export function InfoTable({ title, icon, rows }: InfoTableProps) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-5 sm:p-6">
      <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <div className="divide-y divide-border/50">
       {rows.map((row, idx) => (
  <div key={`${row.label}-${idx}`} className="flex items-center justify-between py-2.5">
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-semibold font-mono text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TwoColInfo ────────────────────────────────────────────────────────────────
export function TwoColInfo({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {children}
    </div>
  );
}

// ── StyledSelect ──────────────────────────────────────────────────────────────
interface StyledSelectProps {
  value:     string;
  onChange:  (v: string) => void;
  options:   { value: string; label: string }[];
  id?:       string;
}

export function StyledSelect({ value, onChange, options, id }: StyledSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-xl border border-border",
          "bg-background px-4 py-3 pr-10 text-sm font-medium text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer",
          "hover:border-border/80 transition-colors"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ── ToggleGroup ───────────────────────────────────────────────────────────────
interface ToggleGroupProps {
  options:   { value: string; label: string }[];
  value:     string;
  onChange:  (v: string) => void;
  accent:    string; // active bg class e.g. "bg-orange-500"
}

export function ToggleGroup({ options, value, onChange, accent }: ToggleGroupProps) {
  return (
    <div className="flex gap-1 p-1 bg-secondary rounded-xl">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
            value === opt.value
              ? `${accent} text-white shadow-sm`
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}