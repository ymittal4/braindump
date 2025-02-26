import { useRef, useState } from "react";
import { useScramble } from "use-scramble";

const AnimatedText = () => {

    const randomTexts = [
        'Braindump for the media & places I experience', 
        'does this work',
        'yolo tolotolo',
        'pls work'
    ]

    const [count, setCount] = useState(0)

    const { ref } = useScramble({ 
        text: randomTexts[count % randomTexts.length] 
    });

    return (
        <div>
            <div ref={ref} className="text-5xl font-semibold tracking-tight flex justify-between pt-8 pb-8"> </div>
            <button onClick={() => 
                setCount(count + 1)}> Click me to learn about Yash
            </button>
        </div>
    )
}

export default AnimatedText;