import { type LucideIcon } from "lucide-react";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";

interface PageShellProps {
  title:        string;
  description:  string;
  icon:         LucideIcon;
  iconGradient: string;
  iconShadow:   string;
  children:     React.ReactNode;
}

export default function PageShell({
  title, description, icon: Icon,
  iconGradient, iconShadow, children,
}: PageShellProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex gap-6 xl:gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">

          {/* Page header */}
          <div className="mb-6 sm:mb-8 flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0",
              iconGradient, iconShadow
            )}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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

          {children}
        </div>
      </div>
    </div>
  );
}