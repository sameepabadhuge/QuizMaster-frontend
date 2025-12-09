import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post("http://localhost:5000/api/students/register", formData);
      if (res.data.message) {
        alert(res.data.message);
        navigate("/login"); // Redirect to login after registration
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Student Registration</h1>
        <p className="text-center text-gray-600 mb-6">Create your account to get started</p>
        {message && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{message}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          {["firstName","lastName","username","email","password","confirmPassword"].map(field => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700">{field.charAt(0).toUpperCase()+field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                required
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
