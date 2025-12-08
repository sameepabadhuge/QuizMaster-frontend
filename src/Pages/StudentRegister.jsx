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
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-blue-100 shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Student Registration</h1>
        {message && <div className="mb-4 text-red-600">{message}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          {["firstName","lastName","username","email","password","confirmPassword"].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                required
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-900"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-500 font-medium">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
