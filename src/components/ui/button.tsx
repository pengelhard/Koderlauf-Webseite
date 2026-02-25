import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold uppercase tracking-[0.14em] ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-koder focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-koder text-white shadow-orange-glow hover:bg-[#e86100] hover:shadow-orange-strong",
        secondary:
          "bg-forest-deep text-text-soft shadow-lg hover:bg-[#0f4e36] hover:shadow-orange-glow",
        ghost:
          "bg-transparent text-text-soft hover:bg-primary-koder/10 hover:text-white",
        outline:
          "border border-primary-koder/25 bg-transparent text-text-soft hover:border-primary-koder/60 hover:bg-primary-koder/10",
      },
      size: {
        default: "h-12 px-6 py-2",
        lg: "h-14 px-8 text-[0.8rem]",
        xl: "h-16 px-10 text-[0.82rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
