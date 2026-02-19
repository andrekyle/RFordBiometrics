import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 text-xs font-normal rounded-full transition-colors [&_svg]:stroke-[1px]",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
        outline: "border border-input text-foreground",
        success: "text-[hsl(var(--success))]",
        warning: "text-[hsl(var(--warning))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
