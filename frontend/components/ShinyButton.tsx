"use client"

import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function ShinyButton({
  children,
  className,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-3 md:px-8 md:py-4 font-semibold text-white text-sm md:text-base',
        'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
        'transform transition-all duration-200 hover:scale-105',
        'shadow-lg hover:shadow-xl',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </button>
  )
}