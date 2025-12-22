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
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-blue-900/20 mix-blend-multiply" />
      </div>

      {/* Brand top-left */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="absolute top-0 left-0 p-6 md:p-8 z-20"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600 drop-shadow-md">
          quizMaster
        </h1>
      </Motion.div>

      {/* Main content (aligned to right on larger screens) */}
      <div className="relative min-h-screen flex flex-col items-center md:items-end justify-center px-6 md:px-10 lg:px-16 text-center md:text-right z-20">
        {/* CTA */}
        <div className="w-full max-w-xl bg-transparent rounded-2xl p-6 md:p-8">
          <div className="mt-0 max-w-xl mx-auto">
            
            

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
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
              className="mt-12 flex items-center justify-center md:justify-end gap-4 text-sm text-white/80 font-medium"
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
      {/* Headline and description (shifted to right) */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="absolute inset-x-0 top-20 md:top-24 px-6 md:px-8 z-20 flex justify-center md:justify-end"
      >
        <div className="max-w-2xl text-center md:text-right md:mr-10 lg:mr-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow">
            Master Your Knowledge!
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/90 font-medium leading-relaxed">
            Engaging quizzes to help students learn and teachers teach. Join our community of lifelong learners today.
          </p>
        </div>
      </Motion.div>
    </div>
  );
};

export default Landing;
