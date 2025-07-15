import { ChangeEvent, useContext } from "react";
import React from "react";
import ThemeContext from "../context/ThemeContext";


const ToggleButton = () => {

    const { isDark, setIsDark } =useContext(ThemeContext)

    const handleClick = () => {
        setIsDark(!isDark)
    }

    return (
        <div className="flex items-center gap-2"> 
            <label className="switch relative inline-block w-11 h-6">
                <input 
                    className="peer opacity-0 w-0 h-0" 
                    type='checkbox'
                    onChange={handleClick}
                    checked={isDark} 
                />
                <span className={`absolute cursor-pointer inset-0 rounded-full 
                    transition-all duration-300
                    before:content-[''] before:absolute before:h-5 before:w-5 before:left-[2px] before:bottom-[2px]
                    before:bg-white before:rounded-full before:transition-all before:duration-300 
                    peer-checked:before:translate-x-5 ${
                        isDark 
                            ? 'bg-stone-400 peer-checked:bg-green-400' 
                            : 'bg-stone-400 peer-checked:bg-purple-500'
                    }`}>
                </span>
            </label>
            {/* <span className="text-sm">{isDark ? '🌙' : '☀️'}</span> */}
        </div>
    )   
}


export default ToggleButton;
