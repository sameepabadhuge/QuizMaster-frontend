import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    if (password.length < 6)
      return "Password must be at least 6 characters.";

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

      const response = await axios.post(endpoint, payload);

      alert(response.data.message || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
        "Registration failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-6">Join QuizMaster today</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Register as
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("Student")}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  role === "Student"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👨‍🎓 Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("Teacher")}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  role === "Teacher"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👨‍🏫 Teacher
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Subject for Teacher */}
          {role === "Teacher" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-semibold text-gray-700">
                Subject You Teach <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:bg-gray-300"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
