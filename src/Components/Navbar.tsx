import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import ToggleButton from './ToggleButton';


const Navbar = () => {
    return (
        <div className='flex justify-between pt-8 pb-8'> 
            <div className='flex gap-2'>
                <Button text="home" to="/home" />
                <Button text="snake" to="/" />
            </div>
            <div className='flex gap-2'>
                <Button text="blog" to="/blog" />
                <ToggleButton />
            </div>
        </div>
    )
}

export default Navbar