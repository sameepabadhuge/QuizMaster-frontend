import React from "react";
import { Link } from "react-router-dom";

import landingImg from "../assets/landing.avif";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-blue-100 via-purple-50 to-pink-50">
      
      {/* Navbar */}
      <nav className="w-full bg-blue-600 shadow-lg py-4 px-6 flex justify-between items-center ">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            quizMaster 
          </h1>
        </div>


        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Login/Register
          </Link>
        </div>
        
      </nav>

      {/* image */}
      <section className="text-center flex flex-col items-center px-6 mt-12 animate-fadeIn">
        <img
          src={landingImg}
          alt="students learning"
          className="w-1/4 md:w-1/2 mb-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        />
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-blue-600 drop-shadow-lg">
          Master Your Knowledge! 
        </h2>
        <p className="text-gray-700 max-w-xl text-center mb-8 text-lg md:text-xl">
         Engaging quizzes to help students learn and teachers teach.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/quiz-list"
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition transform"
          >
            Get Started 
          </Link>
          
        </div>
      </section>

      
    </div>
  );
};

export default Landing;
