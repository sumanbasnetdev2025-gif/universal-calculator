"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface CardProps {
  title:       string;
  description: string;
  href:        string;
  icon:        LucideIcon;
  gradient:    string;
  iconBg:      string;
}

export default function CalculatorCard({
  title, description, href, icon: Icon, gradient, iconBg,
}: CardProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "group relative rounded-2xl p-4 sm:p-5 h-full",
        "bg-white/5 border border-white/10",
        "hover:border-white/20 hover:bg-white/[0.08]",
        "transition-all duration-300 hover:-translate-y-0.5",
        "cursor-pointer overflow-hidden"
      )}>
        {/* Corner accent */}
        <div className={cn(
          "absolute top-0 right-0 w-20 h-20 rounded-bl-[3rem] opacity-10 group-hover:opacity-20 transition-opacity",
          gradient
        )} />

        {/* Arrow */}
        <ArrowRight className="absolute top-3.5 right-3.5 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />

        {/* Icon */}
        <div className={cn(
          "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm shrink-0",
          iconBg
        )}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>

        {/* Text */}
        <h3 className="font-display text-sm sm:text-[15px] font-semibold text-foreground mb-1 pr-5 group-hover:text-violet-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}