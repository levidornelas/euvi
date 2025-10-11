import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "hover:cursor-pointer inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm !px-32 !py-7 font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-transparent focus-visible:ring-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-[#0650FF] hover:bg-blue-700 focus:outline-none focus:ring-blue-300 text-white font-medium text-lg shadow-xl transition",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "bg-none border border-[#145ccc] text-primary hover:bg-blue-100 font-medium rounded-full text-lg px-8 py-4 shadow-xs transition",
        secondary:
          "bg-none border border-[#145ccc] text-primary hover:bg-blue-100 font-medium rounded-full text-lg px-8 py-4 shadow-xs transition",
        ghost:
          "bg-blue-100 hover:bg-blue-200 text-primary text-lg",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
