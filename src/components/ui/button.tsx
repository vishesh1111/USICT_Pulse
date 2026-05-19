import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-focus transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-pulse-500 to-pulse-600 text-white shadow-lg shadow-pulse-500/20 hover:from-pulse-500 hover:to-pulse-700 hover:shadow-xl hover:shadow-pulse-500/30 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] active:translate-y-0 dark:shadow-pulse-500/25 dark:hover:shadow-pulse-500/40",
        destructive:
          "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-border bg-background/40 backdrop-blur hover:border-pulse-500/50 hover:bg-pulse-500/10 hover:text-foreground hover:shadow-md hover:shadow-pulse-500/15 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        link: "text-pulse-500 underline-offset-4 hover:text-pulse-400 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
