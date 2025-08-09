"use client"

import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, ReactNode } from "react"
import { fadeInVariants } from "@/lib/utils/animations"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  backgroundClass?: string
  containerClass?: string
  animate?: boolean
}

export function SectionWrapper({ 
  children, 
  className = "",
  backgroundClass = "",
  containerClass = "container px-4 md:px-6",
  animate = true
}: SectionWrapperProps) {
  const controls = useAnimation()
  const { ref, inView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    if (animate) {
      if (inView) {
        controls.start("visible")
      } else {
        controls.start("hidden")
      }
    }
  }, [controls, inView, animate])

  const MotionDiv = animate ? motion.div : "div"
  const motionProps = animate ? {
    ref,
    initial: "hidden",
    animate: controls,
    variants: fadeInVariants,
  } : {}

  return (
    <section className={cn("w-full py-12 md:py-18 lg:py-24", backgroundClass, className)}>
      <MotionDiv 
        className={containerClass}
        {...motionProps}
      >
        {children}
      </MotionDiv>
    </section>
  )
}