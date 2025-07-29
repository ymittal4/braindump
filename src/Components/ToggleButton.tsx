import { useContext } from "react";
import React from "react";
import ThemeContext from "../context/ThemeContext";

const ToggleButton = () => {
    const { isDark, setIsDark } = useContext(ThemeContext);

    const handleToggle = () => {
        setIsDark(!isDark);
    };

    return (
        <div className="flex items-center gap-2">
            <label className="relative inline-block w-11 h-6">
                <input 
                    className="peer opacity-0 w-0 h-0" 
                    type="checkbox"
                    onChange={handleToggle}
                    checked={isDark} 
                />
                <span className="absolute cursor-pointer inset-0 bg-stone-400 rounded-sm 
                    transition-all duration-300
                    before:content-[''] before:absolute before:h-4 before:w-4 before:left-[4px] before:top-[4px]
                    before:bg-white before:rounded-none before:transition-all before:duration-300 
                    peer-checked:bg-blue-500 peer-checked:before:translate-x-3">
                </span>
            </label>
        </div>
    );   
}


export default ToggleButton;