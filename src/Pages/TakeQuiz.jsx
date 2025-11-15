import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/createquiz/quiz/${quizId}`)
      .then(res => {
        setQuizData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [quizId]);

  if (loading) return <div>Loading...</div>;
  if (!quizData) return <div>Quiz not found!</div>;

  const question = quizData.questions[currentIndex];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleSubmit = () => {
    axios.post("http://localhost:5000/api/student-quiz/submit-quiz", { quizId, answers })
      .then(res => navigate("/quiz-result", { state: res.data }))
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">{quizData.title}</h2>
      <div className="text-right mb-4">Question {currentIndex + 1} / {quizData.questions.length}</div>

      <div className="p-5 border rounded-lg bg-gray-50 mb-6">
        <h3 className="text-xl font-bold mb-4">{question.question}</h3>
        {question.options.map((option, idx) => (
          <label key={idx} className={`block p-3 border rounded-lg cursor-pointer ${answers[currentIndex] === option ? "bg-blue-100 border-blue-600" : ""}`}>
            <input type="radio" checked={answers[currentIndex] === option} onChange={() => handleOptionSelect(option)} className="mr-2" />
            {option}
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button disabled={currentIndex===0} onClick={()=>setCurrentIndex(currentIndex-1)}>Previous</button>
        {currentIndex+1 === quizData.questions.length ?
          <button onClick={handleSubmit}>Submit Quiz</button> :
          <button onClick={()=>setCurrentIndex(currentIndex+1)}>Next</button>
        }
      </div>
    </div>
  );
}
