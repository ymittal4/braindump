import gsap from "gsap";
import { useRef, useState } from "react";
import { TextPlugin } from "gsap/all";
import { useEffect } from "react";
gsap.registerPlugin(TextPlugin)


const AnimatedText = () => {
    const ref = useRef<HTMLHeadingElement>(null)

    const [count, setCount] = useState(0)

    const randomTexts = [
        'Braindump for the media & places I experience', 
        'does this work',
        'yolo tolotolo',
        'pls work'
    ]

    useEffect(() => {
        // console.log('effect running')
        gsap.to(ref.current, {
            duration: 1,
            text: randomTexts[count % randomTexts.length],
            ease: "none",
          });
    },[count]);


    //const to store how many underscores for initial animation
    const initValue = randomTexts[0].length

    return (
        <div>
            <div ref={ref} className="text-5xl font-semibold tracking-tight flex justify-between pt-8 pb-8"> {"_".repeat(initValue)}</div>
            <button onClick={() => 
                setCount(count + 1)}> Click me to learn about Yash
            </button>
        </div>
    )
}

export default AnimatedText;