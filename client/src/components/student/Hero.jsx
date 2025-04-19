import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-br from-blue-400 via-purple-200 to-pink-100'>
        <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>Shape your future with courses tailored to{' '}
  <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
    your passion and pace
  </span><img src={assets.sketch} alt="sketch" className='md:block hidden absolute-bottom-7 right-0' /></h1>
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
      Learn from top instructors, dive into interactive lessons, and grow with a community that’s here to support your journey—both personally and professionally.      </p>

      <p className='md:hidden text-gray-500 max-w-sm mx-auto'>
      Partner with expert instructors who are committed to helping you succeed professionally.
      </p>
      <SearchBar/>
    </div>
  )
}

export default Hero