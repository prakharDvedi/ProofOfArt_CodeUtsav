'use client'

import { motion } from 'framer-motion'
import AnimatedButton from './components/AnimatedButton'

// New: Variants for the main title
const title = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 * i },
  }),
}

// New: Variants for each word
const word = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(5px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
}

// New: Variants for subtitle and buttons
const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 1.0 }, // Delay after title
  },
}

const buttonsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, delay: 1.2 }, // Delay after subtitle
  },
}

export default function Home() {
  const mainTitle = 'Verifiable Authorship for AI-Generated Art'
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading with Word-by-Word Animation */}
        <motion.h1
          variants={title}
          className="text-5xl md:text-7xl font-bold text-white tracking-tighter"
        >
          {mainTitle.split(' ').map((text, index) => (
            <motion.span
              key={index}
              variants={word}
              className="inline-block mr-[0.25em]" // Add space between words
              // Apply gradient to the "special" words
              style={
                ['Verifiable', 'Authorship', 'AI-Generated'].includes(text)
                  ? {
                      background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
                  : {}
              }
            >
              {text}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={subtitleVariants}
          className="text-xl md:text-2xl text-slate-300 max-w-2xl"
        >
          Create, verify, and own your digital creations. Our platform binds
          your identity, your prompt, and your art to the blockchain—forever.
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          variants={buttonsVariants}
          className="flex flex-col md:flex-row gap-4 mt-6"
        >
          <AnimatedButton
            href="/create"
            className="bg-white/10 hover:bg-white/20"
          >
            Create Your Proof
          </AnimatedButton>
          
          <AnimatedButton
            href="/verify"
            className="bg-black/10 hover:bg-black/20"
          >
            Verify an Artwork
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </div>
  )
}