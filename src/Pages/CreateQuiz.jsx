import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [lectureName, setLectureName] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0 }
  ]);
  
  // Dashboard state
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const teacherId = sessionStorage.getItem("teacherId");

  useEffect(() => {
    const teacherData = sessionStorage.getItem("teacher");
    if (teacherData) {
      const teacher = JSON.parse(teacherData);
      setLectureName(teacher.username || `${teacher.firstName} ${teacher.lastName}`);
    }
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      const res = await axios.get(`http://localhost:5000/api/createquiz/teacher/${teacherId}`);
      if (res.data.success) {
        setMyQuizzes(res.data.quizzes || []);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const resetForm = () => {
    setQuizTitle("");
    setQuizDescription("");
    setSubject("");
    setDuration(10);
    setDifficulty("Easy");
    setQuestions([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
    setEditingQuizId(null);
    // Reset lecture name to teacher's name
    const teacherData = sessionStorage.getItem("teacher");
    if (teacherData) {
      const teacher = JSON.parse(teacherData);
      setLectureName(teacher.username || `${teacher.firstName} ${teacher.lastName}`);
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id);
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description || "");
    setLectureName(quiz.lectureName || "");
    setSubject(quiz.subject || "");
    setDuration(quiz.duration || 10);
    setDifficulty(quiz.difficulty || "Easy");
    setQuestions(
      quiz.questions.map((q) => ({
        text: q.question,
        options: q.options,
        correctIndex: q.correctAnswer,
      }))
    );
    setShowCreateForm(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/createquiz/${quizId}`, {
        data: { teacherId }
      });
      if (res.data.success) {
        alert("Quiz deleted successfully!");
        setDeleteConfirm(null);
        fetchMyQuizzes();
      }
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("Failed to delete quiz: " + (err.response?.data?.message || err.message));
    }
  };

  const addQuestion = () =>
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]);

  const removeQuestion = (i) =>
    setQuestions(questions.filter((_, index) => index !== i));

  const handleQuestionChange = (i, value) => {
    const q = [...questions];
    q[i].text = value;
    setQuestions(q);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const q = [...questions];
    q[qIndex].options[oIndex] = value;
    setQuestions(q);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const q = [...questions];
    q[qIndex].correctIndex = oIndex;
    setQuestions(q);
  };

  const handleSaveQuiz = async () => {
    // Validation
    if (!quizTitle.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          alert(`Question ${i + 1}, Option ${j + 1} is empty`);
          return;
        }
      }
    }

    try {
      const payload = {
        title: quizTitle,
        description: quizDescription,
        lectureName,
        subject,
        duration: parseInt(duration) || 10,
        difficulty,
        teacherId: sessionStorage.getItem("teacherId"),
        questions: questions.map((q) => ({
          question: q.text,
          options: q.options,
          correctAnswer: q.correctIndex,
        })),
      };

      console.log("Sending payload:", payload);

      let res;
      if (editingQuizId) {
        // Update existing quiz
        res = await axios.put(
          `http://localhost:5000/api/createquiz/${editingQuizId}`,
          payload
        );
      } else {
        // Create new quiz
        res = await axios.post(
          "http://localhost:5000/api/createquiz",
          payload
        );
      }

      console.log("Response:", res.data);

      if (res.data.success) {
        alert(editingQuizId ? "Quiz updated successfully!" : "Quiz saved successfully!");
        resetForm();
        setShowCreateForm(false);
        fetchMyQuizzes();
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save quiz";
      alert("Failed to save quiz: " + errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        
        {/* My Quizzes Dashboard */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-teal-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-800 flex items-center gap-2">
              <span className="bg-teal-100 p-2 rounded-lg">📚</span>
              My Quizzes
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(!showCreateForm);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg transform hover:-translate-y-0.5 ${
                showCreateForm
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
              }`}
            >
              {showCreateForm ? "✕ Cancel" : "➕ Create New Quiz"}
            </button>
          </div>

          {loadingQuizzes ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
              <p className="text-teal-600">Loading your quizzes...</p>
            </div>
          ) : myQuizzes.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-teal-50 to-white rounded-xl border-2 border-dashed border-teal-200">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-teal-700 text-lg font-medium mb-2">You haven't created any quizzes yet.</p>
              <p className="text-teal-500">Click "Create New Quiz" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-gradient-to-br from-white to-teal-50 p-5 rounded-xl border border-teal-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-teal-900 truncate flex-1">{quiz.title}</h3>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                      quiz.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      quiz.difficulty === "Medium" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-rose-100 text-rose-700 border border-rose-200"
                    }`}>
                      {quiz.difficulty || "Easy"}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-2 mb-4 text-teal-700">
                    <p className="flex items-center gap-2">
                      <span className="text-teal-500">📖</span>
                      <span className="truncate">{quiz.lectureName || "No lecture"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-teal-500">📚</span>
                      <span className="truncate">{quiz.subject || "No subject"}</span>
                    </p>
                    <div className="flex items-center gap-4 pt-2 border-t border-teal-100">
                      <p className="flex items-center gap-1">
                        <span className="text-teal-500">❓</span>
                        <span className="font-semibold">{quiz.questions?.length || 0}</span>
                        <span className="text-teal-500">Q's</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="text-teal-500">⏱️</span>
                        <span className="font-semibold">{quiz.duration || 10}</span>
                        <span className="text-teal-500">min</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(quiz._id)}
                      className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  {/* Delete Confirmation */}
                  {deleteConfirm === quiz._id && (
                    <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                      <p className="text-rose-700 text-sm font-medium mb-3">⚠️ Delete this quiz permanently?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Quiz Form */}
        {showCreateForm && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-teal-800">
              {editingQuizId ? "✏️ Edit Quiz" : "➕ Create New Quiz"}
            </h2>

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-teal-100">
          <h3 className="text-lg font-bold mb-5 text-teal-800 flex items-center gap-2">
            <span className="bg-teal-100 p-2 rounded-lg">📋</span>
            Quiz Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">Quiz Title</label>
              <input type="text" placeholder="Enter quiz title" value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full p-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-teal-50/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1">Lecture Name</label>
              <input type="text" placeholder="Enter lecture name" value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
                className="w-full p-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-teal-50/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">Subject</label>
                <input type="text" placeholder="e.g., Mathematics" value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-teal-50/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">Duration (minutes)</label>
                <input type="number" placeholder="10" value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-teal-50/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">Difficulty</label>
                <select value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-teal-50/30"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-teal-100">
          <h3 className="text-lg font-bold mb-5 text-teal-800 flex items-center gap-2">
            <span className="bg-teal-100 p-2 rounded-lg">❓</span>
            Questions
          </h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 border-2 border-teal-100 p-5 rounded-xl bg-gradient-to-br from-teal-50/50 to-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                  Question {qIndex + 1}
                </label>
                <button  
                  onClick={() => removeQuestion(qIndex)}
                  className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors shadow-md"
                >
                  🗑️ Remove
                </button>
              </div>
              
              <input type="text" placeholder={`Enter question ${qIndex + 1}`} value={q.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full p-3 border-2 border-teal-100 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white"
              />

              <p className="text-sm font-medium text-teal-700 mb-2">Options (select the correct answer)</p>
              <div className="space-y-3 mb-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className={`flex gap-3 items-center p-2 rounded-lg transition-all ${
                    q.correctIndex === oIndex ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-gray-50 border-2 border-transparent'
                  }`}>
                    <input type="radio" name={`correct-${qIndex}`}
                      checked={q.correctIndex === oIndex}
                      onChange={() => handleCorrectChange(qIndex, oIndex)}
                      className="w-5 h-5 text-teal-600 accent-teal-600"
                    />
                    <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 p-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition bg-white"
                    />
                    {q.correctIndex === oIndex && (
                      <span className="text-emerald-600 font-semibold text-sm">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            ➕ Add Question
          </button>
        </div>

        <button onClick={handleSaveQuiz} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
          {editingQuizId ? "✅ Update Quiz" : "✅ Save Quiz"}
        </button>
          </>
        )}
      </div>
    </div>
  );
}
