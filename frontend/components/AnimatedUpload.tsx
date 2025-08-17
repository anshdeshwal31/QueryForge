"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import clsx from 'clsx'
import ShinyButton from './ShinyButton'

export default function AnimatedUpload({ onSubmit }: {
  onSubmit: (file: File, questions: string[]) => Promise<void> | void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [questions, setQuestions] = useState('')
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    try {
      // Accept free-form input; split on ?, !, . or new lines but keep natural phrasing.
      const qs = questions
        .split(/(?<=[\?!.])\s+|\n+/g)
        .map(q => q.trim())
        .filter(Boolean)
        .slice(0, 20) // safety cap
      await onSubmit(file, qs)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={clsx(
          "rounded-2xl border-2 border-dashed p-4 md:p-8 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm",
          drag ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20" : "border-gray-700 hover:border-gray-600"
        )}
      >
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-base md:text-lg font-semibold text-white mb-2">Drop your document here</p>
          <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">Supports PDF, DOCX, TXT, and MD files</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
            id="file-upload"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label 
            htmlFor="file-upload"
            className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-gray-600 rounded-lg text-xs md:text-sm font-medium text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-colors cursor-pointer"
          >
            Choose File
          </label>
          <AnimatePresence>
            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-xs md:text-sm text-green-400 flex items-center gap-2">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {file.name}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Questions Section */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700 p-4 md:p-6">
        <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2 md:mb-3">
          What would you like to know?
        </label>
        <textarea
          rows={4}
          placeholder="Ask anything about your document. You can write multiple questions separated by new lines or periods."
          className="w-full rounded-xl border border-gray-600 bg-gray-800/50 p-3 md:p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
        />
        <div className="mt-3 md:mt-4 flex justify-end">
          <ShinyButton onClick={handleSubmit} disabled={loading || !file}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Ask Questions'
            )}
          </ShinyButton>
        </div>
      </div>
    </div>
  )
}
