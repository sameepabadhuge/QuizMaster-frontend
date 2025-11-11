import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav.jsx";

import Landing from "./Pages/Landing.jsx";
import Home from "./Pages/Home.jsx";
import QuizList from "./Pages/QuizList.jsx";
import QuizResult from "./Pages/QuizResult.jsx";
import Leaderboard from "./Pages/Leaderboard.jsx";



function App() {
  return (
    <>
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-result"element={<QuizResult />} />
        <Route path="/leader-board" element={<Leaderboard />} />
        
      </Routes>
    </Router>


    </>
  );
}

export default App;
