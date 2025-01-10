import { useState } from 'react';
import Button from './Button'

function BookData() {

    const TaoData = [
        {
            chapterNumber: 'chapter 1',
            index: 0,
            quote: 'chapter 1 quote',
            feeling: 'chapter 1 feeling'
        },
        {
            chapterNumber: '2',
            index: 1,
            quote: 'lole',
            feeling: 'okoo'
        }
    ]
    
    const [chapter, setChapter] = useState(TaoData[0])
    const [error, setError] = useState('')
    
    function changeData() {
        let currentIndex = chapter.index
        let newIndex = currentIndex + 1

        if (newIndex > TaoData.length-1) {
            let newIndex = currentIndex
            setChapter(TaoData[newIndex])
            setError('No more chapters left')
        }   else {
            setChapter(TaoData[newIndex])
        }
     
    }
    
    <button onClick={changeData}> 
        'next chapter'
    </button>
    
    return (
        <div> 
            <h1> {chapter.chapterNumber}</h1>
            <h2> {chapter.quote}</h2>
            <h2> {chapter.feeling}</h2>
            <br></br>
            <button onClick={changeData}> 
                'next chapter'
            </button>
            {/* <div>{errorStatement}</div> */}
            <div className='text-red-500'>{error}</div>
        </div>
        
    )
}


export default BookData;