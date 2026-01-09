import React from 'react'

const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-slate-200 text-slate-900",
  destructive: "bg-red-500 text-white",
  outline: "border border-slate-300",
}

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
        transition-colors ${badgeVariants[variant]} ${className}
      `}
      {...props}
    />
  )
}