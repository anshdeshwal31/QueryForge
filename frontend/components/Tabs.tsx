"use client"

import { useState } from 'react'

export default function Tabs({ tabs }: { tabs: { key: string, label: string, content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key ?? '')
  return (
    <div>
      <div className="flex gap-1 md:gap-2 mb-4 md:mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-xl px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all duration-300 ${
              active === t.key 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  )
}
