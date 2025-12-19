import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
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
    const { firstName, lastName, username, email, password, confirmPassword, subject } = formData;

    if (!firstName.trim()) return "Please enter your first name.";
    if (!lastName.trim()) return "Please enter your last name.";
    if (!username.trim()) return "Please enter a username.";

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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-teal-100/30 to-teal-50 p-4 relative selection:bg-teal-100 selection:text-teal-900">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-teal-100 relative z-10"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center mb-2 text-teal-600"
        >
          Create Account
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 mb-6"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                👨‍🏫 Teacher
              </motion.button>
            </div>
          </motion.div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              autoComplete="username"
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Subject for Teacher */}
          {role === "Teacher" && (
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <label className="block text-sm font-semibold text-gray-700">
                Subject You Teach
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
                className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
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
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-600 mt-1">
              Must include uppercase, lowercase, number & special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className="w-full p-3 mt-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Login
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
