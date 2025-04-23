import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
const CallToAction = () => {
  
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
        <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>
        Learn anything,anytime,anywhere
        </h1>
        <p className='text-gray-500 sm:text-sm'>No matter where you are or what your schedule looks like, unlock your potential through flexible, expert-designed courses that empower you to learn and grow on your terms.</p>
        <div className='flex items-center font-medium gap-6 mt-4'>
          <button className='px-10 py-3 rounded-md text-white bg-blue-600'><a href="#">Get Started</a></button>
          <Link to='/learn-more'><button className='flex items-center gap-2'>Learn More<img src={assets.arrow_icon} alt="arrow_icon" /></button></Link> 
        </div>
    </div>
  )
}

export default CallToAction