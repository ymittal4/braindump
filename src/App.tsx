import Navbar from './Components/Navbar'
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogPage from './Pages/BlogPage'
import HomePage from './Pages/HomePage';
import ThemeContext from './context/ThemeContext';
import WeatherContext from './context/WeatherContext';
import SongPage from './Pages/SongPage';

function App() {

  // State to track whether dark mode is enabled (false = light mode, true = dark mode)
  const [isDark, setIsDark] = useState(false);

  //State to track whether the weather icon is hovered over
  const [isHovered, setHovered] = useState(false);

    return (
      // Provide theme and weather hover context to all child components
      <ThemeContext.Provider value={{ isDark, setIsDark }}> 
        <WeatherContext.Provider value={{ isHovered, setHovered }}>
          <BrowserRouter>
              <div className={`flex min-h-screen justify-center font-inter ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'} transition-colors duration-300 `}>
                <div className='w-full max-w-6xl px-4'>
                  <Navbar />
                    <Routes>
                      <Route path='/' element={<HomePage />} />
                      <Route path='/home' element={<HomePage />} />
                      <Route path='/blog' element={<BlogPage />} />
                      <Route path='/SongPage' element={<SongPage />} />
                    </Routes>
                </div>
              </div>
          </BrowserRouter>
        </WeatherContext.Provider>
      </ThemeContext.Provider>
    )
}

export default App