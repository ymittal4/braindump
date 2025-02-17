import { useState } from "react";

type HoverCallbacks = {
    onMouseEnterCallback?: (isHovered:boolean, hoveredItems?:string) => void
    onMouseLeaveCallback?: (isHovered:boolean, hoveredItems?:string) => void
}

function useHover(callBacks?: HoverCallbacks, hoveredItems?:string) {
    const [isHovered, setIsHovered] = useState(false)
    const hoverProps = {
        onMouseEnter: (event: React.MouseEvent) => {
            setIsHovered(true);
            const hoveredCountry = (event.currentTarget as HTMLElement).dataset.hoveredCountry
            callBacks?.onMouseEnterCallback?.(true, hoveredCountry);
        },
        onMouseLeave: (event: React.MouseEvent) => {
            setIsHovered(false);
            const hoveredCountry = (event.currentTarget as HTMLElement).dataset.hoveredCountry
            callBacks?.onMouseLeaveCallback?.(false, hoveredCountry)
        }
    }
    return [isHovered, hoverProps] as const
}

export default useHover