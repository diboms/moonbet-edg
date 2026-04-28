import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-edg-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-800 disabled:pointer-events-none disabled:opacity-40 active:scale-95",
  {
    variants: {
      variant: {
        // EDG primary — gradient violet→bleu signature
        default:
          "bg-edg-gradient text-white shadow-lg shadow-edg-600/30 hover:shadow-edg-500/50 hover:brightness-110 uppercase tracking-wider text-xs",
        // Moon — or/jaune pour les actions Moons
        moon:
          "bg-moon-gradient text-zinc-900 shadow-lg shadow-moon-500/25 hover:shadow-moon-500/40 hover:brightness-110 font-bold",
        // Secondaire sombre EDG
        secondary:
          "bg-dark-700 text-zinc-100 border border-dark-500 hover:bg-dark-600 hover:border-edg-500/30",
        // Ghost
        ghost:
          "text-zinc-400 hover:text-zinc-100 hover:bg-dark-700",
        // Destructive
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        // Outline EDG
        outline:
          "border border-edg-500/30 bg-transparent text-edg-300 hover:bg-edg-500/10 hover:text-edg-200 hover:border-edg-400/50",
        // Success
        success:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
        // Rainbow EDG — effet multicolore
        rainbow:
          "bg-edg-rainbow text-white shadow-lg hover:brightness-110 uppercase tracking-wider text-xs",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-13 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
