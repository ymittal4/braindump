// Import necessary components and libraries
import Navbar from './Components/Navbar'
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogPage from './Pages/BlogPage'
import HomePage from './Pages/HomePage';
import ThemeContext from './context/ThemeContext';
function App() {

  // State to track whether dark mode is enabled (false = light mode, true = dark mode)
  const [isDark, setIsDark] = useState(false);

    return (
      // Provide theme context to all child components
      <ThemeContext.Provider value={{ isDark, setIsDark }}> 
        {/* Set up routing with BrowserRouter */}
        <BrowserRouter>
            {/* Main container with dynamic theme classes based on isDark state */}
            <div className={`flex min-h-screen justify-center font-inter ${isDark ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'} transition-colors duration-300 `}>
              {/* Content width container */}
              <div className='w-full max-w-6xl px-4'>
                <Navbar />
                  {/* Route configuration */}
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

// Export the App component as the default export
export default App