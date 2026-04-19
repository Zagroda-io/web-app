"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface PageAnimateProps {
  children: ReactNode
}

export function PageAnimate({ children }: PageAnimateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
