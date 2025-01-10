import Navbar from './Components/Navbar'
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogPage from './Pages/BlogPage'
import HomePage from './Pages/HomePage';
import ThemeContext from './context/ThemeContext';
import animatedText from './Components/AnimatedText';


function App() {

  const [isDark, setIsDark] = useState(true);

    return (
      <ThemeContext.Provider value={{ isDark, setIsDark }}> 
        <BrowserRouter>
            {/* <div className={`flex min-h-screen justify-center font-mono ${isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'} transition-colors duration-300`}> */}
            <div className={`flex min-h-screen justify-center font-mono ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'} transition-colors duration-300 `}>
              <div className='w-full max-w-4xl px-4'>
                <Navbar />
                  <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/blog' element={<BlogPage />} />
                  </Routes>
              </div>
            </div>
        </BrowserRouter>
      </ThemeContext.Provider>
    )
}

export default App