'use client'

import { useContext } from 'react'
import dynamic from 'next/dynamic'
import ThemeContext from "../src/context/ThemeContext"
import WeatherContext from "../src/context/WeatherContext"
import AnimatedText from "../src/Components/AnimatedText"
import CurrentMedia from "../src/Components/CurrentMedia"

const TravelGrid = dynamic(() => import("../src/Components/TravelGrid").then(m => m.TravelGrid), { ssr: false })
const Weather = dynamic(() => import("../src/Components/Weather"), { ssr: false })

export default function HomePage() {
  const { isDark } = useContext(ThemeContext)
  const { isHovered, setHovered } = useContext(WeatherContext)

  return (
    <div className="space-y-6"> 
      <div className="flex justify-end w-4/5">
        <Weather className={isHovered ? "opacity-100" : "opacity-0"} />
      </div>
      
      <div> 
        <AnimatedText />
      </div>
      
      <div className="pt-10 pb-2 font-mono text-xs">/ CURRENTLY</div>
      <hr className="w-full border-gray-300" />
      
      <div>
        <CurrentMedia />
      </div>
      
      <div className="my-10">
        <TravelGrid />
      </div>
    </div>
  )
}
