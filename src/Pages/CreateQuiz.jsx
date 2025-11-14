import React, { useState } from "react";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctIndex = oIndex;
    setQuestions(newQuestions);
  };

  const handleSaveQuiz = () => {
    const payload = { quizTitle, quizDescription, questions };
    console.log("Saving Quiz:", payload);
    alert("Quiz saved! Check console for data.");
    // You can call your API here to save the quiz
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Create New Quiz</h2>

      {/* Quiz Details */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-bold mb-2">Quiz Details</h3>
        <p className="text-gray-500 mb-4">Provide basic information about your quiz.</p>

        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          placeholder="Quiz Description (Optional)"
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Quiz Questions */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Quiz Questions</h3>
          <button
            onClick={addQuestion}
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          >
            + Add Question
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Question {qIndex + 1}</h4>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Remove Question
              </button>
            </div>

            <textarea
              placeholder="Question Text"
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctIndex === oIndex}
                    onChange={() => handleCorrectChange(qIndex, oIndex)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveQuiz}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
      >
        Save Quiz
      </button>
    </div>
  );
}
