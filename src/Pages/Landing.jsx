import React from "react";
import { Link } from "react-router-dom";
import landingImg from "../assets/test2.avif";

const Landing = () => {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Full Screen Image Background */}
      <img
        src={landingImg}
        alt="students learning"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Navbar */}
      <nav className="relative w-full shadow-xl py-5 px-8 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              quizMaster
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Login/Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Text Content - Positioned at Bottom */}
      <div className="relative z-10 pb-20 px-8 text-center flex items-end justify-center flex-1">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-2xl leading-tight">
            Master Your Knowledge!
          </h2>
          <p className="text-xl md:text-2xl text-white mb-10 drop-shadow-lg font-medium">
            Engaging quizzes to help students learn and teachers teach.
          </p>
          <Link
            to="/quiz-list"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:from-blue-700 hover:to-blue-800 hover:shadow-3xl hover:scale-110 transition-all duration-300 transform hover:-translate-y-2 text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
