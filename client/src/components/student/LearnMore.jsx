import React from 'react'
import { Link } from 'react-router-dom';
const LearnMore = () => {

  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Learn More About Our LMS</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">📘 What is This LMS?</h2>
        <p className="text-lg leading-relaxed">
          Our Learning Management System (LMS) is a modern educational platform built to empower both students and educators. It allows educators to create and manage courses, while students can learn interactively, track their progress, and engage with course material—all in one place.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">🚀 Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Create and manage multi-chapter courses</li>
          <li>Rich text editing for lectures (powered by Quill)</li>
          <li>Secure user authentication with Clerk</li>
          <li>Interactive contact form with real-time email delivery</li>
          <li>AI-powered support (chatbot, course recommendations coming soon!)</li>
          <li>Live streaming support for real-time classes and webinars</li>
          <li>Dark/light mode toggle for better accessibility</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">🔐 Built with Modern Tech</h2>
        <p className="text-lg leading-relaxed">
          Our LMS is developed using cutting-edge technologies:
        </p>
        <ul className="list-disc list-inside space-y-2 text-lg mt-2">
          <li>Frontend: <strong>React (Vite)</strong></li>
          <li>Backend: <strong>Express.js</strong> with <strong>MongoDB</strong></li>
          <li>Authentication: <strong>Clerk</strong></li>
          <li>UI Enhancements: <strong>Framer Motion, Tailwind CSS</strong></li>
          <li>Real-time functionality: <strong>Coming soon with WebRTC / Daily.co</strong></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">🌟 Why Choose Our LMS?</h2>
        <p className="text-lg leading-relaxed">
          We believe in making education accessible, engaging, and modern. Whether you're an educator who wants a better way to reach students, or a learner looking to grow your skills, our LMS is built to support your journey.
        </p>
      </section>

      <div className="text-center mt-10">
      <Link to='/'>
        <button
          
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-6 rounded-xl transition"
        >
          Get Started Now
        </button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default LearnMore;

