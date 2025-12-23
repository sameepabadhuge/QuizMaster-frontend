import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import homeBg from '../assets/pp3.jpg';

function Home() {
  const navigate = useNavigate();
  const studentName = sessionStorage.getItem("studentName") || "Student";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative selection:bg-blue-100 selection:text-blue-900"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      {/* Darkening overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 left-4 md:top-6 md:left-8 text-left pt-2 md:pt-4 pb-2 md:pb-4 px-4 z-20"
      >
        <h1 className="text-lg md:text-xl lg:text-2xl font-normal mb-2 text-white">
          Welcome back, <span className="text-blue-700 font-normal">{studentName}!</span>
        </h1>
        <p className="text-sm md:text-sm text-white max-w-xl">
          Ready to test your knowledge? Choose an option below,
        </p>
      </motion.div>

      {/* Cards container - centered vertically and horizontally */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center gap-8 px-4">
        
        {/* Card 1: Take Quiz */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: 'easeOut',
            y: { delay: 1.0, duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
          }}
          whileHover={{ scale: 1.06, y: -12 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-400 rounded-2xl p-6 w-64 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer text-center border-2 border-blue-300"
        >
          <div className="text-4xl mb-3">📝</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Take Quiz</h2>
          <p className="mb-4 text-sm text-gray-700">Challenge yourself with quizzes and improve your scores.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz-list')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-sm"
          >
            Start Quiz
          </motion.button>
        </motion.div>

        {/* Card 2: My Results */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: 'easeOut',
            y: { delay: 1.3, duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
          }}
          whileHover={{ scale: 1.06, y: -12 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-400 rounded-2xl p-6 w-64 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer text-center border-2 border-blue-300"
        >
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">My Results</h2>
          <p className="mb-4 text-sm text-gray-700">View your quiz history, scores, and detailed performance.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz-result')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-sm"
          >
            View Results
          </motion.button>
        </motion.div>

        {/* Card 3: Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{
            delay: 0.4,
            duration: 0.5,
            ease: 'easeOut',
            y: { delay: 1.6, duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
          }}
          whileHover={{ scale: 1.06, y: -12 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-400 rounded-2xl p-6 w-64 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer text-center border-2 border-blue-300"
        >
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Leaderboard</h2>
          <p className="mb-4 text-sm text-gray-700">See where you rank among other students.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/leader-board')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-sm"
          >
            View Leaderboard
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

export default Home;
