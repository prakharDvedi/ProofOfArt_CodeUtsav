'use client'

import { Tilt } from 'react-tilt'
import { motion, MotionProps } from 'framer-motion'
import React from 'react'

// Define default tilt options
const defaultOptions = {
  reverse: false, // reverse the tilt direction
  max: 25, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt
  scale: 1.05, // 1.05 = 5% increase
  speed: 1000, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit
  axis: null, // What axis should be enabled. Can be "x", "y" or null
  reset: true, // If the tilt effect has to be reset on exit
  easing: 'cubic-bezier(.03,.98,.52,.99)', // Easing on enter/exit
}

// Combine props: We want to accept all Framer Motion props and standard div props
type Props = MotionProps &
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    className?: string
  }

const AnimatedGlassCard = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <Tilt options={defaultOptions}>
        <motion.div
          ref={ref}
          className={`glass-card ${className}`} // Apply base glass-card style
          {...props} // Spread all other Framer Motion props
        >
          {children}
        </motion.div>
      </Tilt>
    )
  },
)
// Set display name for easier debugging
AnimatedGlassCard.displayName = 'AnimatedGlassCard'

export default AnimatedGlassCard