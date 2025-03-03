import { useContext } from 'react';
import Button from './Button';
import ToggleButton from './ToggleButton';
import WeatherContext from '../context/WeatherContext';

const Navbar = () => {

    const { setHovered } = useContext(WeatherContext)

    return (
        <div className='flex justify-between pt-8 pb-8'> 
            <div className='flex gap-2'>
                <Button text="HOME" to="/home" />
                <Button text="ME" to="/" />
            </div>
            <div className='flex gap-2'>
                <Button text="blog" to="/blog" />
                <ToggleButton />
                <div className='opacity-50'
                    onMouseEnter = {() => {setHovered(true)}}
                    onMouseLeave = {() => {setHovered(false)}}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Navbar