import React, { useState } from 'react';
import { loginChef } from '../../api/chefAuth';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginChef(username, password);
      
      // Save chef name for dashboard
      localStorage.setItem("chefName", data.chef.name);

      // Show message and redirect
      setMessage(`Welcome, ${data.chef.name}!`);
      setTimeout(() => navigate("/chef-dashboard"), 1000);

    } catch (err) {
      setMessage(err.message || "Server error");
    }
  };

  return (
    <div className="font-nunito max-w-md mx-auto p-6 mt-20 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Chef Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-black">{message}</p>}
    </div>
  );
}
