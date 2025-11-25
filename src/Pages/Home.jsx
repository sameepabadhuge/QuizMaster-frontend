import React from 'react'
import homepageImg from '../assets/test2.avif';

function Home() {
  return (
    <div>
      
      {/* image */}
      <img
          src={homepageImg}
          alt="students learning"
          className="w-1/4 md:w-1/2 mb-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
      />
    </div>
  )
}

export default Home
