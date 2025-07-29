import { useContext } from 'react';
import Link from 'next/link';
import ThemeContext from '../context/ThemeContext';

interface ButtonProps {
    text: string;
    to?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

const Button = ({ text, to, onClick, variant = 'secondary' }: ButtonProps) => {
    const { isDark } = useContext(ThemeContext);

    const baseClasses = 'text-xs tracking-wide py-1 px-2 transition-colors duration-200';
    const variantClasses = {
        primary: isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: isDark ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    };
    
    const buttonClass = `${baseClasses} ${variantClasses[variant]}`;

    if (to) {
        return (
            <Link href={to} className={buttonClass}>
                {text}
            </Link>
        );
    }

    return (
        <button className={buttonClass} onClick={onClick}>
            {text}
        </button>
    );
}

export default Button;
