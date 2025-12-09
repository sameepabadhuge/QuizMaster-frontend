import React from 'react';
import homepageImg from '../assets/test2.avif';

function Home() {
  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${homepageImg})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Cards container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full gap-8 px-4">
        
        {/* Card 1: Take Quiz */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-72 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer text-center text-white border border-white/20">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-3">Take Quiz</h2>
          <p className="mb-6 text-gray-100">Students can attempt quizzes and check their scores instantly.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
            Start Quiz
          </button>
        </div>

        {/* Card 2: Add MCQ */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-72 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer text-center text-white border border-white/20">
          <div className="text-5xl mb-4">✏️</div>
          <h2 className="text-2xl font-bold mb-3">Add MCQs</h2>
          <p className="mb-6 text-gray-100">Teachers can create and manage multiple-choice questions easily.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
            Add Question
          </button>
        </div>

        {/* Card 3: Leaderboard */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-72 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer text-center text-white border border-white/20">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-3">Leaderboard</h2>
          <p className="mb-6 text-gray-100">Check top-performing students and track your progress.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
            View Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;
