"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

function FloatingPaths({ position, colorScheme = "default" }) {
  // Optimize by reducing the number of paths and making them more dynamic
  const paths = Array.from({ length: 24 }, (_, i) => {
    const offset = i * 8
    return {
      id: i,
      d: `M-${380 - offset * position} -${189 + offset}C-${
        380 - offset * position
      } -${189 + offset} -${312 - offset * position} ${216 - offset} ${
        152 - offset * position
      } ${343 - offset}C${616 - offset * position} ${470 - offset} ${
        684 - offset * position
      } ${875 - offset} ${684 - offset * position} ${875 - offset}`,
      width: 0.5 + i * 0.04,
    }
  })

  // Color scheme options
  const colorSchemes = {
    default: {
      light: "rgba(15,23,42,",
      dark: "rgba(255,255,255,",
    },
    blue: {
      light: "rgba(59,130,246,",
      dark: "rgba(96,165,250,",
    },
    purple: {
      light: "rgba(124,58,237,",
      dark: "rgba(139,92,246,",
    },
  }

  const scheme = colorSchemes[colorScheme] || colorSchemes.default

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.015}
            className="text-slate-950 dark:text-white"
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: [0.3, 0.8, 0.3],
              opacity: [0.3, 0.5, 0.3],
              pathOffset: [0, 0.5, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function BackgroundPaths({
  title = "xLOAD",
  subtitle = "upLOAD images freely",
  colorScheme = "default",
  buttonText = "Try Demo !",
}) {
  const words = title.split(" ")
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle SSR hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Stagger animation for elements
  useEffect(() => {
    if (mounted) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          type: "spring",
          stiffness: 120,
          damping: 20,
        },
      }))
    }
  }, [controls, mounted])

  const handleHover = (hover) => {
    setIsHovered(hover)
  }

  const handleNavigate = () => {
    window.location.href = "/demo"
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-500">
      <div className="absolute inset-0">
        <FloatingPaths position={1} colorScheme={colorScheme} />
        <FloatingPaths position={-1} colorScheme={colorScheme} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    custom={wordIndex + letterIndex * 0.05}
                    initial={{ y: 100, opacity: 0 }}
                    animate={controls}
                    className="inline-block text-transparent bg-clip-text 
                              bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 
                              dark:from-white dark:via-neutral-200 dark:to-neutral-400"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <AnimatePresence>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.6,
              }}
              className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-lg mx-auto"
            >
              {subtitle}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                      dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                      overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            <Button
              variant="ghost"
              onClick={handleNavigate}
              className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                       bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                       text-black dark:text-white transition-all duration-300 
                       group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                       hover:shadow-md dark:hover:shadow-neutral-800/50"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">{buttonText}</span>
              <motion.span
                className="ml-3 opacity-70 inline-block"
                animate={isHovered ? { x: 6, opacity: 1 } : { x: 0, opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                →
              </motion.span>
            </Button>

            {/* Add subtle glow effect */}
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0"
              animate={isHovered ? { opacity: 0.5 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

