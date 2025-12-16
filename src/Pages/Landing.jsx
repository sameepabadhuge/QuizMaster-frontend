import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import landingImg from "../assets/s.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative font-sans selection:bg-teal-100 selection:text-teal-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section - Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 py-20 md:py-0 bg-gradient-to-br from-teal-50 via-teal-100/30 to-teal-50">
          <div className="mt-0 max-w-xl">
            <Motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-teal-600 tracking-tight">
                quizMaster
              </h1>
            </Motion.div>
            
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-[1.2] tracking-tight text-gray-900">
                Master Your Knowledge!
              </h2>
            </Motion.div>
            
            <Motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-700 mb-12 font-medium leading-relaxed max-w-lg"
            >
              Engaging quizzes to help students learn and teachers teach. Join our community of lifelong learners today.
            </Motion.p>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-teal-600 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5"
                role="button"
              >
                Get Started Now
                <svg 
                  className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Motion.div>

            {/* Social Proof / Trust Indicator */}
            <Motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex items-center gap-4 text-sm text-gray-500 font-medium"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Trusted by 1000+ students</p>
            </Motion.div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full md:w-1/2 h-64 md:h-screen relative overflow-hidden bg-gradient-to-br from-teal-200 via-teal-50/80 to-teal-200">
          <Motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={landingImg}
            alt="Students collaborating on a quiz"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent md:bg-teal-900/10 mix-blend-multiply"></div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
