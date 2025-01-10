import gsap from "gsap";
import { useRef, useState } from "react";
import { TextPlugin } from "gsap/all";
import { useEffect } from "react";
gsap.registerPlugin(TextPlugin)


const AnimatedText = () => {
    const ref = useRef<HTMLHeadingElement>(null)

    const [count, setCount] = useState(0)

    const randomTexts = [
        'Welcome to my experience as a human', 
        'does this work',
        'yolo tolotolo',
        'pls work'
    ]

    useEffect(() => {
        console.log('effect running')
        gsap.to(ref.current, {
            duration: 1,
            text: randomTexts[count % randomTexts.length],
            ease: "none",
          });
    },[count]);

    const initValue = randomTexts[0].length

    return (
        <div>
            <h1 ref={ref}> {"_".repeat(initValue)}</h1>
            <button onClick={() => 
                setCount(count + 1)}> Click to see my favorite media
            </button>
        </div>
    )
}

export default AnimatedText;