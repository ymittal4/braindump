import { useState } from "react";

function useHover() {
    const [isHovered, setIsHovered] = useState(false)

    const hoverProps = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false)
    }
    return [isHovered, hoverProps] as const
}

export default useHover
