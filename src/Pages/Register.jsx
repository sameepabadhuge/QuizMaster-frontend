import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import bgImage from "../assets/1.avif";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    subject: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(), // removes leading spaces only
    }));
  };

  // Switch role
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");

    if (selectedRole === "Student") {
      setFormData((prev) => ({ ...prev, subject: "" }));
    }
  };

  // Validation Function
  const validateForm = () => {
    const { fullName, email, password, confirmPassword, subject } = formData;

    if (!fullName.trim()) return "Please enter your full name.";

    if (!email.trim()) return "Please enter your email.";

    // Basic email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    if (!password) return "Please enter a password.";

    // Strong password validation
    if (password.length < 8)
      return "Password must be at least 8 characters.";
    
    // Check for at least one uppercase, one lowercase, one number, and one special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return "Password must include uppercase, lowercase, number, and special character.";
    }

    if (!confirmPassword)
      return "Please confirm your password.";

    if (password !== confirmPassword)
      return "Passwords do not match.";

    if (role === "Teacher" && !subject.trim())
      return "Please enter the subject you teach.";

    return null; // No errors
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        role === "Student"
          ? "http://localhost:5000/api/students/register"
          : "http://localhost:5000/api/teachers/register";

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        ...(role === "Teacher" && { subject: formData.subject.trim() }),
      };

      console.log("Sending registration data:", { ...payload, password: "***", confirmPassword: "***" });

      const response = await axios.post(endpoint, payload);

      console.log("Registration successful:", response.data);
      alert(response.data.message || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      console.error("Error details:", err.response?.data);
      setError(
        err.response?.data?.message ||
        "Registration failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-white/30 relative z-10"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center mb-2 text-white drop-shadow-lg"
        >
          Create Account
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/90 mb-6"
        >
          Join QuizMaster today
        </motion.p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-white mb-2">
              Register as
            </label>
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => handleRoleChange("Student")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  role === "Student"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                👨‍🎓 Student
              </motion.button>

              <motion.button
                type="button"
                onClick={() => handleRoleChange("Teacher")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  role === "Teacher"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                👨‍🏫 Teacher
              </motion.button>
            </div>
          </motion.div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-white">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              autoComplete="username"
              className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
            />
          </div>

          {/* Subject for Teacher */}
          {role === "Teacher" && (
            <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
              <label className="block text-sm font-semibold text-white">
                Subject You Teach
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
                className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 chars with A-Z, a-z, 0-9, !@#$"
              autoComplete="new-password"
              className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
            />
            <p className="text-xs text-white/70 mt-1">
              Must include uppercase, lowercase, number & special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl disabled:bg-gray-300"
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-white/90"
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-300 hover:text-blue-100 font-semibold"
          >
            Login
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
