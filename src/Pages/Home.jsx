import React from 'react';
import homepageImg from '../assets/test2.avif';

function Home() {
  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${homepageImg})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Cards container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full gap-8 px-4">
        
        {/* Card 1: Take Quiz */}
        <div className="rounded-xl p-8 w-72 transform hover:scale-105 transition-transform duration-300 cursor-pointer text-center text-white drop-shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Take Quiz</h2>
          <p className="mb-4">Students can attempt quizzes and check their scores instantly.</p>
          <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
            Start Quiz
          </button>
        </div>

        {/* Card 2: Add MCQ */}
        <div className="rounded-xl p-8 w-72 transform hover:scale-105 transition-transform duration-300 cursor-pointer text-center text-white drop-shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Add MCQs</h2>
          <p className="mb-4">Teachers can create and manage multiple-choice questions easily.</p>
          <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
            Add Question
          </button>
        </div>

        {/* Card 3: Leaderboard */}
        <div className="rounded-xl p-8 w-72 transform hover:scale-105 transition-transform duration-300 cursor-pointer text-center text-white drop-shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
          <p className="mb-4">Check top-performing students and track your progress.</p>
          <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
            View Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;
