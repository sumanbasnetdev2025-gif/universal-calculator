"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  delay?: string;
}

export default function CalculatorCard({
  title,
  description,
  href,
  icon: Icon,
  gradient,
  iconBg,
  delay = "",
}: CalculatorCardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "group relative bg-white dark:bg-white/5 rounded-2xl p-6 border border-border/60",
          "card-hover cursor-pointer overflow-hidden opacity-0 animate-fade-up",
          delay
        )}
      >
        {/* Decorative corner shape */}
        <div className={cn(
          "absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-15 group-hover:opacity-25 transition-opacity",
          gradient
        )} />

        {/* Arrow */}
        <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-70 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowRight className="w-4 h-4 text-foreground" />
        </div>

        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm",
          iconBg
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Text */}
        <h3 className="font-display text-base font-semibold text-foreground mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}