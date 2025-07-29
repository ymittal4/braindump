"use client";

import { useState } from "react";
import { useScramble } from "use-scramble";

const RANDOM_TEXTS = [
    'Braindump for the media & places I experience',
    'Welcome to my digital space',
    'Exploring tech, music, and travel',
    'Always building something new'
] as const;

const AnimatedText = () => {
    const [textIndex, setTextIndex] = useState(0);

    const { ref } = useScramble({
        text: RANDOM_TEXTS[textIndex % RANDOM_TEXTS.length]
    });

    const handleTextCycle = () => {
        setTextIndex(prev => prev + 1);
    };

    return (
        <div className="space-y-4">
            <div 
                ref={ref} 
                className="text-5xl font-semibold tracking-tight pt-8 pb-8"
            />
            <button 
                onClick={handleTextCycle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
                Click me to learn about Yash
            </button>
        </div>
    );
}

export default AnimatedText;