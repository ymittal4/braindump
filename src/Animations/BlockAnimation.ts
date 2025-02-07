function BlockAnimation
    (arr: number[], 
    blockIsHovered: number | null, 
    //can either accept array of numbers of a function that takes previous array and combines with new array 
    setActiveBlocks:(
        value: number[] | ((prev: number[]) => number[])
     ) => void) {

    const resetDuration = 0
    const activeBlock = blockIsHovered

    console.log("blocIsHovered is", blockIsHovered)

    arr.forEach((block) => {
        let timeoutId; 
        console.log("test test", block)
        if (block == activeBlock && activeBlock) {
            console.log("Active block is", block)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                console.log("pushing active block index to array", block)
                setActiveBlocks((prev:number[]) => [...prev, block])

                setTimeout(() => {
                    setActiveBlocks((prev:number[]) => prev.filter(b => b != block))
                }, 500)
            }, resetDuration);
        }
        
    })
    return 
}

export default BlockAnimation;

