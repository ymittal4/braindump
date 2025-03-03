import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

type ButtonProps = {
    text: string; //for button text
    to?: string; //for link (optional)
}

const Button = ({text, to}: ButtonProps) => {

    const { isDark } = useContext(ThemeContext)

    const buttonClass = `text-xs tracking-wide py-1 px-2 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`;
    // <div className={`w-1/4 h-auto border p-4 shadow-xl absolute ${isDark ? 'text-white bg-gray-900' : 'text:black bg-white'}`}>


    return to? (
        <Link to={to} className={buttonClass}>
            {text}
        </Link>
    ) : ( //if link is not provided, then 
        <button className = {buttonClass}>
            {text}
        </button>
    );
}

export default Button;
