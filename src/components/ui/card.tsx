"use client";

import * as React from "react";
import { cn } from "@/lib/shadcn/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    data-slot="card"
    className={cn(
      "rounded-xl border border-neutral-800 bg-neutral-950/70 text-neutral-100 shadow-sm",
      "backdrop-blur supports-backdrop-blur:bg-neutral-950/60",
      className
    )}
    {...props}
  />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="card-header"
    className={cn("p-4 border-b border-neutral-800", className)}
    {...props}
  />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    data-slot="card-title"
    className={cn("font-semibold tracking-tight", className)}
    {...props}
  />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div data-slot="card-content" className={cn("p-4", className)} {...props} />
);


