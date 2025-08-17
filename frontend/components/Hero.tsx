"use client"

import DarkVeil from '../src/block/Backgrounds/DarkVeil/DarkVeil'
import ShinyButton from './ShinyButton'

export default function Hero() {
  const scrollToUpload = () => {
    const element = document.getElementById('uploadSection');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* <div className='h-full'> */}

    <DarkVeil  speed={1.5}/>
      {/* </div> */}
    <div className="absolute top-0 left-0 md:left-[22vw] min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 " />
      
      {/* Background decorations - hidden on mobile to prevent overflow */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96  rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80  rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Become emboldened by
          <br />
          <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            the flame of ambition
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload PDFs or Word docs and get instant, grounded answers powered by advanced AI. 
          Transform your documents into interactive knowledge bases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ShinyButton onClick={scrollToUpload}>Get Started</ShinyButton>
        </div>
      </div>


    </div>
    </div>
  )
}
