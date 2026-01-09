import React from 'react'

const buttonVariants = {
  default: "bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white hover:opacity-90",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-slate-300 bg-transparent hover:bg-slate-50",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  ghost: "hover:bg-slate-100",
  link: "text-primary underline-offset-4 hover:underline",
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
}

export const Button = React.forwardRef(({
  className = "",
  variant = "default",
  size = "default",
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-lg
        text-sm font-medium transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${buttonVariants[variant]} ${buttonSizes[size]} ${className}
      `}
      {...props}
    />
  )
})
Button.displayName = "Button"