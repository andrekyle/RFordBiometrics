import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "accent" | "warning" | "destructive";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-3 sm:p-5 transition-all hover:shadow-lg azure-shadow">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <p className="text-[11px] sm:text-xs font-light text-muted-foreground uppercase tracking-wide">{title}</p>
        <Icon className={cn(
          "h-4 w-4 sm:h-5 sm:w-5",
          variant === "primary" && "text-primary",
          variant === "accent" && "text-accent",
          variant === "warning" && "text-[hsl(var(--warning))]",
          variant === "destructive" && "text-destructive",
          variant === "default" && "text-muted-foreground",
        )} strokeWidth={1} />
      </div>
      <p className="text-xl sm:text-3xl font-normal text-foreground mb-1">{value}</p>
      {trend && <p className="text-[11px] sm:text-xs font-light text-muted-foreground">{trend}</p>}
    </div>
  );
}
