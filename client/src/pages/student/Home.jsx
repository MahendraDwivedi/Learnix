import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CourseSection from '../../components/student/CourseSection'
import Testimonials from '../../components/student/Testimonials'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import NewLetter from '../../components/student/NewsLetter'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center bg-gradient-to-br from-purple-200 to-pink-100'>
        <Hero/>
        <Companies/>
        <CourseSection/>
        <Testimonials/>
        <CallToAction/>
        <NewLetter/>
        <Footer/>
    </div>
  )
}

export default Home