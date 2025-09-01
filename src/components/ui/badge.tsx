"use client";

import * as React from "react";
import { cn } from "@/lib/shadcn/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "destructive" | "muted";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs";
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-neutral-800 text-neutral-200",
    success: "bg-green-600/20 text-green-400 ring-1 ring-inset ring-green-600/40",
    destructive:
      "bg-red-600/20 text-red-400 ring-1 ring-inset ring-red-600/40",
    muted: "bg-neutral-900 text-neutral-400 ring-1 ring-inset ring-neutral-800",
  };
  return (
    <span
      data-slot="badge"
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};


