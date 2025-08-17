"use client"

import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs'
import AnimatedUpload from '../components/AnimatedUpload'
import Hero from '../components/Hero'
import {Navbar} from '../components/Navbar'
import Tabs from '../components/Tabs'
import Footer from '../components/Footer'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

export default function Page() {
  const { isSignedIn, getToken } = useAuth()
  const [answers, setAnswers] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (file: File, questions: string[], streaming = false) => {
    if (!isSignedIn) {
      setError('Please sign in to continue')
      return
    }

    setError(null)
    setAnswers(null)

    const form = new FormData()
    form.append('file', file)
    form.append('questions', JSON.stringify(questions))

    try {
      if (streaming) {
        toast("Document Uploaded✨",
          {
            description:"Processing the document",
            // style:{
            //   background:"white",
            //   padding:"12px",
            //   color:"black"
            // }
          }
        )
        const res = await fetch(`${API_BASE}/hackrx/stream-file`, {
          method: 'POST',
          body: form,
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          setError(errorData.error || 'Request failed')
          return
        }
        
        if (!res.body) {
          setError('Streaming not supported by the server')
          return
        }
        
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        const answersAcc: string[] = []
        let currentIndex = -1
        
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n\n').filter(Boolean)
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            try {
              const payload = JSON.parse(line.slice(5))
              if (payload.type === 'start') {
                setAnswers([])
              } else if (payload.type === 'question') {
                currentIndex = payload.index
                answersAcc[currentIndex] = ''
                setAnswers([...answersAcc])
              } else if (payload.type === 'answer') {
                answersAcc[payload.index] = (answersAcc[payload.index] || '') + payload.delta
                setAnswers([...answersAcc])
              } else if (payload.type === 'answer_done') {
                setAnswers([...answersAcc])
              } else if (payload.type === 'error') {
                setError(payload.message)
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e)
            }
          }
        }
        return
      }
      
      toast("Document Uploaded✨",
        {
          description:"Processing the document",
          // style:{
          //   background:"white",
          //   padding:"12px",
          //   color:"black"
          // }
        }
      )
      const res = await fetch(`${API_BASE}/hackrx/run-file`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.error || 'Request failed')
        return
      }

      const data = await res.json()
      setAnswers(data.answers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main id='uploadSection'  className=" container mx-auto px-4 md:px-6 py-8 md:py-16 bg-black relative">
        <motion.div 
          id='auroraBackground1' 
          className='absolute '
          // initial={{ opacity: 1, scale: 0.8 }}
          // animate={{ 
          //   opacity: 1,
          //   scale: [0.8, 1.2, 0.8],
          //   x: [0, 20, -20, 0],
          //   y: [0, -30, 30, 0]
          // }}
          // transition={{
          //   duration: 2,
          //   repeat: Infinity,
          //   ease: "easeInOut"
          // }}
        >
          <motion.div 
            className='w-[150px] sm:w-[200px] h-[300px] sm:h-[400px] blur-3xl bg-indigo-900 absolute'
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className='w-[300px] sm:w-[400px] h-[80px] sm:h-[100px] blur-3xl bg-indigo-900 absolute -left-8 sm:-left-12'
            animate={{
              x: [0, 30, 0],
              y:[0,20,0],
              opacity: 1
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeIn"
            }}
          />
          <motion.div 
            className='w-[300px] sm:w-[400px] h-[80px] sm:h-[100px] blur-3xl bg-indigo-900 absolute -left-24 sm:-left-32'
            animate={{
              y: [0, -20, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <motion.div 
          id='auroraBackground2' 
          className='absolute bottom-32 sm:bottom-48 right-64 sm:right-80'
          // initial={{ opacity: 0, scale: 0.8 }}
          // animate={{ 
          //   opacity:1,
          //   scale: [0.9, 1.3, 0.9],
          //   x: [0, -25, 25, 0],
          //   y: [0, 20, -20, 0]
          // }}
          // transition={{
          //   duration: 16,
          //   repeat: Infinity,
          //   ease: "easeInOut"
          // }}
        >
          <motion.div 
            className='w-[270px] sm:w-[400px] md:w-[400px] h-[150px] sm:h-[200px] blur-3xl bg-indigo-900 absolute'
            animate={{
              // rotate: [0, -360],
              y:[0,30,0],
              x:[0,-30,0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            />
          <motion.div 
            className='w-[150px] sm:w-[200px] h-[80px] sm:h-[100px] blur-3xl bg-indigo-900 absolute -left-8 sm:-left-12'
            animate={{
              x: [0, -40, 40, 0],
              y:[0,30,0],
              opacity: 1
            }}
            transition={{
              duration:11,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className='w-[270px] sm:w-[400px] md:w-[600px] h-[80px] sm:h-[100px] blur-3xl bg-indigo-900 absolute -left-24 sm:-left-32'
            animate={{
              y: [0, 25, -25, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <SignedOut>
          <div className="max-w-xl mx-auto text-center rounded-2xl bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Sign in to start asking</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">You'll use your Clerk account to securely upload files and ask questions.</p>
            <div className="flex justify-center">
              <SignInButton>
                <button className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-sm md:text-base">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:items-start">
              {/* Upload Section */}
              <div className="space-y-6">
                <div className="rounded-2xl bg-gray-900/30 backdrop-blur-sm p-4 md:p-6 border border-gray-800 h-[600px] md:h-[745px] flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <Tabs
                      tabs={[
                        {
                          key: 'standard',
                          label: 'Standard',
                          content: <AnimatedUpload onSubmit={(f,q) => submit(f,q,false)} />,
                        },
                        {
                          key: 'streaming',
                          label: 'Streaming',
                          content: <AnimatedUpload onSubmit={(f,q) => submit(f,q,true)} />,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Answers Section */}
              <div className="rounded-2xl bg-gray-900/30 backdrop-blur-sm p-4 md:p-6 border border-gray-800 h-[600px] md:h-[745px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-white">AI Answers</h2>
                </div>
                
                {error && (
                  <div className="p-3 md:p-4 bg-red-900/50 border border-red-700 rounded-lg mb-4">
                    <p className="text-red-400 text-xs md:text-sm">{error}</p>
                  </div>
                )}
                
                <div className="flex-1 overflow-hidden">
                  {answers ? (
                    <div className="h-full overflow-y-auto pr-2 space-y-3 md:space-y-4">
                      {answers.map((answer, i) => (
                        <div key={i} className="p-3 md:p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-gray-200 leading-relaxed text-sm md:text-base">{answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-base md:text-lg font-medium mb-2">No answers yet</p>
                      <p className="text-gray-500 text-xs md:text-sm">Upload a document and ask questions to see intelligent answers here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SignedIn>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
