import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Components/Card";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/createquiz/");
        if (res.data.success) setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(
    q =>
      (q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.subject?.toLowerCase().includes(search.toLowerCase()) ||
        q.lectureName?.toLowerCase().includes(search.toLowerCase())) &&
      (difficulty === "All" || q.difficulty === difficulty)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">📚 Available Quizzes</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input 
            type="text" 
            placeholder="🔍 Search by subject, title, or lecture name" 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
          />
          <select 
            value={difficulty} 
            onChange={e=>setDifficulty(e.target.value)} 
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">No quizzes found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(q => (
              <Card key={q._id} quiz={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
