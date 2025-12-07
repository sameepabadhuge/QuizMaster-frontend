import React from "react";
import { Link } from "react-router-dom";
import landingImg from "../assets/6.jpg";

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
              className="text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Login/Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Text Content - Centered on Image */}
      <div className="relative flex-1 flex items-center justify-center z-10 px-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl leading-tight">
            Master Your Knowledge!
          </h2>
          <p className="text-xl md:text-2xl text-white mb-10 drop-shadow-lg font-medium">
            Engaging quizzes to help students learn and teachers teach.
          </p>
          <Link
            to="/quiz-list"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 transform hover:-translate-y-2 text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
