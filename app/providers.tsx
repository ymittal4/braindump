'use client'

import { useState } from 'react'
import ThemeContext from '../src/context/ThemeContext'
import WeatherContext from '../src/context/WeatherContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [isHovered, setHovered] = useState(false)

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <WeatherContext.Provider value={{ isHovered, setHovered }}>
        {children}
      </WeatherContext.Provider>
    </ThemeContext.Provider>
  )
}
