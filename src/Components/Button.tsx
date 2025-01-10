import { useState } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
    text: string; //for button text
    to?: string; //for link (optional)
}

const Button = ({text, to}: ButtonProps) => {
    const buttonClass = 'text-sm border-2 py-1 px-3 rounded-lg border-gray-700';

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
