import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/quiz-hero.png"; // 🖼️ Add your hero image inside /src/assets/

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold text-blue-600">Quiz Master</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Login
          </Link>
          <Link
            to="/student-register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Sign Up (Student)
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center flex flex-col items-center px-6 mt-12">
        <img
          src={heroImg}
          alt="students learning"
          className="w-[400px] md:w-[500px] mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Master Your Knowledge with Quiz Master
        </h2>
        <p className="text-gray-600 max-w-xl text-center mb-8">
          Create, take, and track quizzes with ease. Perfect for students to test
          their understanding and for teachers to manage educational content
          effectively.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/student-register"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Get Started (Student Sign Up)
          </Link>
          <Link
            to="/login"
            className="border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
          >
            I Already Have An Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Quiz Master. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

