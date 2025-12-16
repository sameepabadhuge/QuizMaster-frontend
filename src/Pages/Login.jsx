import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../assets/s3.jpg";   // <-- IMPORTANT: import background

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = { role: role.toLowerCase(), email, password };

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        return;
      }

      if (role.toLowerCase() === "student") {
        localStorage.setItem("role", "student");
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentId", data.user._id);
        localStorage.setItem("student", JSON.stringify({ email: data.user.email }));
        navigate("/home");
      } else {
        localStorage.setItem("role", "teacher");
        localStorage.setItem("teacherToken", data.token);
        localStorage.setItem("teacherId", data.user._id);
        navigate("/teacher-home");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-teal-100/30 to-teal-50 p-4 relative selection:bg-teal-100 selection:text-teal-900">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-md border border-teal-100 relative z-10"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-teal-600 mb-2"
        >
          Welcome Back!
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 mb-8"
        >
          Login to continue your learning journey
        </motion.p>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 bg-red-500/20 text-red-100 border border-red-500/50 rounded-lg text-center backdrop-blur-sm"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 transition-all option:text-gray-900"
            >
              <option value="Student" className="text-gray-900">Student</option>
              <option value="Teacher" className="text-gray-900">Teacher</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400 transition-all"
              placeholder="name@example.com"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400 transition-all"
              placeholder="••••••••"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold mt-4 hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Sign In"}
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-teal-600 hover:text-teal-700 font-bold transition-colors underline decoration-transparent hover:decoration-teal-600"
            >
              Register
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
