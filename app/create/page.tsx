'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import LoadingSpinner from '../components/LoadingSpinner'
import CertificateDisplay from '../components/CertificateDisplay'
import Image from 'next/image'

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
}

// --- Component: Gemini-style Loader ---
function GenerationLoader({ message }: { message: string }) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center justify-center gap-4 glass-card p-6 rounded-xl mb-8"
    >
      <LoadingSpinner size="md" />
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-lg text-slate-300 min-w-[200px] text-center"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

// Define the shape of our proof data
type ProofData = {
  creatorAddress: string
  timestamp: number
  prompt: string
  imageHash: string
  proofHash: string
  txHash: string
  ipfsUrl: string
}

export default function CreatePage() {
  const { isConnected, address } = useAccount()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // --- Page State ---
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('')

  // --- Results State ---
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [proof, setProof] = useState<ProofData | null>(null)

  // Clear states when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setPrompt('')
      setIsLoading(false)
      setError(null)
      setGeneratedImage(null)
      setProof(null)
      setLoadingMessage('')
    }
  }, [isConnected])

  // --- Auto-grow Textarea Handler ---
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    // Reset height to auto to get the correct scrollHeight, then set new height
    e.target.style.height = 'auto'
    // Limit max height to 160px (approx 6 lines) before scrolling
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  // --- Mock API Call Function ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)
    setProof(null)

    // Reset textarea height after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      setLoadingMessage("Analyzing prompt...")
      setTimeout(() => { if (isLoading) setLoadingMessage("Generating artwork...") }, 1000)
      setTimeout(() => { if (isLoading) setLoadingMessage("Finalizing details...") }, 2000)

      await new Promise(resolve => setTimeout(resolve, 2500))
      const mockImageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/512/512`
      setGeneratedImage(mockImageUrl)
      
      setLoadingMessage("Registering proof on the blockchain...")
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockProof: ProofData = {
        creatorAddress: address,
        timestamp: Date.now(),
        prompt: prompt,
        imageHash: '0x' + 'a'.repeat(64),
        proofHash: '0x' + 'b'.repeat(64),
        txHash: '0x' + 'c'.repeat(64),
        ipfsUrl: 'ipfs://' + 'd'.repeat(46),
      }
      setProof(mockProof)

    } catch (err) {
      console.error(err)
      setError('Failed to generate proof. Please try again.')
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  // --- Render Wallet Connect Message ---
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="glass-card text-center p-8 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-xl text-slate-300">Please connect your wallet to create a Proof-of-Art.</p>
          <div className="mt-6 flex justify-center">
            <ConnectButton />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    // Main container takes full remaining height and separates content from input
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      
      {/* --- TOP SECTION: Output Area (Centered) --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center overflow-y-auto pb-32 w-full"
      >
        <AnimatePresence mode="wait">
          {/* Initial Welcome Text (Only show if nothing is happening) */}
          {!isLoading && !generatedImage && !error && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center text-slate-400 max-w-md"
            >
              <h2 className="text-4xl font-bold text-white/20 mb-4">What will you create?</h2>
              <p>Enter a prompt below to generate unique, verifiable AI art.</p>
            </motion.div>
          )}

          {/* Loader */}
          {isLoading && !generatedImage && (
            <GenerationLoader message={loadingMessage} />
          )}

          {/* Error */}
          {error && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-red-400 bg-red-900/50 p-4 rounded-lg mb-8"
            >
              {error}
            </motion.div>
          )}

          {/* Generated Image */}
          {generatedImage && !proof && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center"
            >
              <div className="relative glass-card p-2 rounded-2xl shadow-2xl">
                <Image
                  src={generatedImage}
                  alt="AI generated art"
                  width={512}
                  height={512}
                  className="rounded-xl"
                  priority
                />
              </div>
              {isLoading && (
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-3 mt-6 bg-black/30 px-6 py-3 rounded-full border border-white/10"
                >
                  <LoadingSpinner size="sm" />
                  <p className="text-slate-200">{loadingMessage}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Certificate */}
          {proof && (
            <div className="w-full flex justify-center">
               <CertificateDisplay proofData={proof} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>


      {/* --- BOTTOM SECTION: Fixed Input Bar --- */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-10"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl relative"
          // The whole bar expands slightly on focus
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
           <div className="glass-card p-2 rounded-3xl flex items-end gap-2 bg-black/40 backdrop-blur-xl border-white/20">
              {/* Auto-growing Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={prompt}
                onChange={handleInput}
                onKeyDown={(e) => {
                  // Allow Enter to submit, Shift+Enter for new line
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Describe the image you want to generate..."
                className="w-full max-h-[160px] py-3 px-4 rounded-2xl bg-transparent text-white text-lg
                           placeholder:text-slate-400 focus:outline-none resize-none
                           scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                disabled={isLoading}
                style={{ minHeight: '52px' }} // Ensure minimum height for one line
              />

              {/* Submit Button (Icon style) */}
              <motion.button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 mb-1 p-3 rounded-full bg-white/10 text-white
                           hover:bg-white/20 transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                   <div className="w-6 h-6"><LoadingSpinner size="sm" /></div>
                ) : (
                  // Standard 'Send' icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                )}
              </motion.button>
           </div>
        </motion.form>
      </motion.div>

    </div>
  )
}