"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Upload, ImageIcon, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function FloatingPaths({ position = 1 }) {
  // Create dynamic paths for the background
  const paths = Array.from({ length: 12 }, (_, i) => {
    const offset = i * 8
    return {
      id: i,
      d: `M-${280 - offset * position} -${189 + offset}C-${
        280 - offset * position
      } -${189 + offset} -${212 - offset * position} ${216 - offset} ${
        152 - offset * position
      } ${343 - offset}C${516 - offset * position} ${470 - offset} ${
        584 - offset * position
      } ${675 - offset} ${584 - offset * position} ${675 - offset}`,
      width: 0.5 + i * 0.04,
    }
  })

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
            strokeOpacity={0.1 + path.id * 0.01}
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

const ImageUploader = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("") // 'success', 'error', or empty
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef(null)
  const controls = useAnimation()

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

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setMessage("")
      setStatus("")

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      setMessage("")
      setStatus("")

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setMessage("")
    setStatus("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImage = async () => {
    if (!file) {
      setMessage("Please select an image first.")
      setStatus("error")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("https://patient-optimism-production.up.railway.app/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage(`Image uploaded successfully! URL: ${data.image_url}`)
        setStatus("success")
      } else {
        setMessage(`Error: ${data.error || "Unknown error"}`)
        setStatus("error")
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
      setStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleHover = (hover) => {
    setIsHovered(hover)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-500">
      {/* Animated background */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
        >
          <Card className="backdrop-blur-lg bg-white/90 dark:bg-black/80 border border-black/5 dark:border-white/10 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-black/5 dark:border-white/10">
              <CardTitle className="text-center">
                <motion.span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-200 dark:to-neutral-400"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  xLOAD
                </motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {!preview ? (
                    <motion.div
                      key="dropzone"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                        isDragging
                          ? "border-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/50"
                          : "border-neutral-200 dark:border-neutral-800"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <ImageIcon className="h-12 w-12 text-neutral-400 dark:text-neutral-500 mb-4" />
                        </motion.div>
                        <motion.p
                          className="text-sm text-neutral-500 dark:text-neutral-400 mb-4"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          Drag and drop your image here, or click to browse
                        </motion.p>
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 p-px rounded-xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                          onMouseEnter={() => handleHover(true)}
                          onMouseLeave={() => handleHover(false)}
                        >
                          <Button
                            variant="ghost"
                            onClick={() => fileInputRef.current.click()}
                            className="rounded-[0.9rem] px-6 py-5 text-sm font-semibold backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 text-black dark:text-white transition-all duration-300 group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10 hover:shadow-md dark:hover:shadow-neutral-800/50"
                          >
                            <span className="opacity-90 group-hover:opacity-100 transition-opacity flex items-center">
                              <Upload className="mr-2 h-4 w-4" /> Select Image
                              <motion.span
                                className="ml-2 opacity-70 inline-block"
                                animate={isHovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.7 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                →
                              </motion.span>
                            </span>
                          </Button>

                          {/* Add subtle glow effect */}
                          <motion.div
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl opacity-0"
                            animate={isHovered ? { opacity: 0.5 } : { opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="relative"
                    >
                      <div className="rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-auto max-h-[250px] object-contain bg-neutral-50 dark:bg-neutral-900"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center"
                      >
                        <X className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                      </motion.button>
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 truncate"
                      >
                        {file?.name}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="inline-block w-full group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 p-px rounded-xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  onMouseEnter={() => handleHover(true)}
                  onMouseLeave={() => handleHover(false)}
                >
                  <Button
                    onClick={uploadImage}
                    disabled={isUploading || !file}
                    className="w-full rounded-[0.9rem] py-6 text-base font-semibold backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 text-black dark:text-white transition-all duration-300 group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10 hover:shadow-md dark:hover:shadow-neutral-800/50"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="opacity-90">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                          <Upload className="mr-2 h-4 w-4 inline-block" /> Upload Image
                        </span>
                        <motion.span
                          className="ml-2 opacity-70 inline-block"
                          animate={isHovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.7 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          →
                        </motion.span>
                      </div>
                    )}
                  </Button>

                  {/* Add subtle glow effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl opacity-0"
                    animate={isHovered ? { opacity: 0.5 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <Alert
                        variant={status === "error" ? "destructive" : "default"}
                        className={
                          status === "success"
                            ? "bg-green-50/80 dark:bg-green-950/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50 backdrop-blur-sm"
                            : "border backdrop-blur-sm bg-white/80 dark:bg-black/50"
                        }
                      >
                        {status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        <AlertDescription className="ml-2 text-sm break-all">{message}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 font-medium">
                        Your image has been successfully uploaded!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ImageUploader

