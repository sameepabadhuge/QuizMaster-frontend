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
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Available Quizzes</h1>
      <input type="text" placeholder="Search your subject" value={search } onChange={e=>setSearch(e.target.value)} className="w-full p-3 border rounded mb-4" />
      <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full p-3 border rounded mb-4">
        <option>All</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : filteredQuizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(q => (
            <Card key={q._id} quiz={q} />
          ))}
        </div>
      )}
    </div>
  );
}
