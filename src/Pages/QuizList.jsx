import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Components/Card";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentResults, setStudentResults] = useState([]); // Store student's quiz results
  const [activeTab, setActiveTab] = useState("available"); // "available" or "failed"

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all quizzes
        const quizRes = await axios.get("http://localhost:5000/api/createquiz/");
        if (quizRes.data.success) {
          setQuizzes(quizRes.data.quizzes);
          // Extract unique subjects from quizzes
          const uniqueSubjects = [...new Set(quizRes.data.quizzes
            .map(q => q.subject)
            .filter(s => s && s.trim() !== "")
          )];
          setSubjects(uniqueSubjects);
        }

        // Fetch student's quiz results if logged in
        const studentId = sessionStorage.getItem("studentId");
        if (studentId) {
          const resultsRes = await axios.get(
            `http://localhost:5000/api/students/student-results/${studentId}`
          );
          if (resultsRes.data.success) {
            setStudentResults(resultsRes.data.results || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper function to get quiz status for a student
  const getQuizStatus = (quizId) => {
    const result = studentResults.find(r => r.quizId === quizId || r.quizId?._id === quizId);
    if (!result) return "not_attempted";
    // Consider 50% or above as passed
    return result.percentage >= 50 ? "passed" : "failed";
  };

  // Filter quizzes based on attempt status
  const availableQuizzes = quizzes.filter(q => {
    const status = getQuizStatus(q._id);
    return status === "not_attempted"; // Only show quizzes not yet attempted
  });

  const failedQuizzes = quizzes.filter(q => {
    const status = getQuizStatus(q._id);
    return status === "failed"; // Only show failed quizzes for retry
  });

  // Get the result for a failed quiz
  const getFailedResult = (quizId) => {
    return studentResults.find(r => r.quizId === quizId || r.quizId?._id === quizId);
  };

  // Apply search and filter to the current tab's quizzes
  const currentQuizzes = activeTab === "available" ? availableQuizzes : failedQuizzes;
  
  const filteredQuizzes = currentQuizzes.filter(
    q =>
      (q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.subject?.toLowerCase().includes(search.toLowerCase()) ||
        q.lectureName?.toLowerCase().includes(search.toLowerCase())) &&
      (difficulty === "All" || q.difficulty === difficulty) &&
      (selectedSubject === "All" || q.subject === selectedSubject)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">📚 Available Quizzes</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "available"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📝 New Quizzes ({availableQuizzes.length})
            </button>
            <button
              onClick={() => setActiveTab("failed")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "failed"
                  ? "bg-red-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🔄 Retry Failed ({failedQuizzes.length})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input 
            type="text" 
            placeholder="🔍 Search by subject, title, or lecture name" 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={selectedSubject} 
              onChange={e=>setSelectedSubject(e.target.value)} 
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="All">All Subjects</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
            <select 
              value={difficulty} 
              onChange={e=>setDifficulty(e.target.value)} 
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">
              {activeTab === "available" 
                ? "🎉 Great job! You've completed all available quizzes!" 
                : "✨ No failed quizzes to retry. Keep up the good work!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(q => (
              <Card 
                key={q._id} 
                quiz={q} 
                isFailed={activeTab === "failed"}
                failedResult={activeTab === "failed" ? getFailedResult(q._id) : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
