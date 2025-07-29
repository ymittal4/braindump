'use client'

import { useContext } from 'react'
import ThemeContext from '../src/context/ThemeContext'

export default function ThemeContainer({ children }: { children: React.ReactNode }) {
  const { isDark } = useContext(ThemeContext)
  return (
    <div className={`flex min-h-screen justify-center font-inter ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'} transition-colors duration-300`}>
      <div className='w-full max-w-6xl px-4'>{children}</div>
    </div>
  )
}
