import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import homeBg from '../assets/1234.avif';

function Home() {
  const navigate = useNavigate();
  const studentName = sessionStorage.getItem("studentName") || "Student";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative selection:bg-blue-100 selection:text-blue-900"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      {/* Optional subtle overlay for readability */}
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-12 md:pt-16 pb-8 md:pb-12 px-4"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900">
          Welcome back, <span className="text-blue-600">{studentName}!</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Ready to test your knowledge? Choose an option below
        </p>
      </motion.div>

      {/* Cards container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 px-4 pb-16 md:pb-20">
        
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
          className="bg-transparent rounded-2xl p-8 w-72 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer text-center border border-blue-100"
        >
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Take Quiz</h2>
          <p className="mb-6 text-gray-700">Challenge yourself with quizzes and improve your scores.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz-list')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
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
          className="bg-transparent rounded-2xl p-8 w-72 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer text-center border border-blue-100"
        >
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">My Results</h2>
          <p className="mb-6 text-gray-700">View your quiz history, scores, and detailed performance.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz-result')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
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
          className="bg-transparent rounded-2xl p-8 w-72 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer text-center border border-blue-100"
        >
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Leaderboard</h2>
          <p className="mb-6 text-gray-700">See where you rank among other students.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/leader-board')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            View Leaderboard
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

export default Home;
