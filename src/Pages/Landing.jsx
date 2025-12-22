import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import landingImg from "../assets/i2.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Full-page background image */}
      <div className="absolute inset-0">
        <Motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={landingImg}
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-blue-900/30 mix-blend-multiply" />
      </div>

      {/* Brand top-left */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="absolute top-0 left-0 p-6 md:p-8 z-20"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 drop-shadow-md">
          quizMaster
        </h1>
      </Motion.div>

      {/* Main content (centered) */}
      <div className="relative min-h-screen flex flex-col items-center md:items-center justify-center px-6 md:px-10 lg:px-16 text-center md:text-center z-20">
        {/* CTA */}
        <div className="w-full max-w-xl bg-transparent rounded-2xl p-6 md:p-8">
          <div className="mt-0 max-w-xl mx-auto">
            

            {/* Headline and description */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight text-white drop-shadow-lg shadow-black whitespace-nowrap">
                Master Your Knowledge!
              </h2>
              <p className="mt-6 text-lg md:text-xl   text-white  leading-relaxed drop-shadow-lg">
                Engaging quizzes to help students learn and teachers teach. Join our community of lifelong learners today.
              </p>
            </Motion.div>

            {/* CTA Button */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8"
            >
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-lg hover:shadow-blue-400/30 hover:-translate-y-0.5"
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
              className="mt-12 flex items-center justify-center md:justify-center gap-4 text-sm text-white/80 font-medium"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center text-xs overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Trusted by 1000+ students</p>
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
