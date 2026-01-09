import React from 'react'

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`
        flex h-10 w-full rounded-lg border border-slate-300 bg-white
        px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none
        focus:ring-2 focus:ring-[#F2C335] disabled:cursor-not-allowed
        disabled:opacity-50 ${className}
      `}
      {...props}
    />
  )
})
Input.displayName = "Input"