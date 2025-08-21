import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginChef } from "../../api/chefAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginChef(username, password);
      localStorage.setItem("chefName", data.chef.name);
      setMessage(`Welcome, ${data.chef.name}!`);
      setTimeout(() => navigate("/chef-dashboard"), 1000);
    } catch (err) {
      setMessage(err.message || "Server error");
    }
  };

  return (
    <div className="relative font-nunito max-w-md mx-auto p-6 mt-20 bg-white rounded-lg shadow-md sm:shadow-md shadow-none overflow-hidden">
      
      {/* Animated Chef Hat PNG */}
      <motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{
    scale: 1,
    opacity: 1,
    y: [0, -8, 0, 8, 0], // bob up & down
    rotate: [0, 3, 0, -3, 0], // swing left/right
  }}
  transition={{
    duration: 4,
    ease: "easeInOut",
    repeat: Infinity,
  }}
  className="flex justify-center mb-4 relative"
>
  <motion.img
    src="/chef-hat.png"
    alt="Chef Hat"
    className="w-24 h-24"
    whileHover={{ scale: 1.05 }}
  />
  
  {/* Glow sweep effect */}
  <motion.div
    className="absolute top-0 left-0 w-full h-full bg-white/30 rounded-full"
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{
      duration: 1,
      delay: 0.5,
      repeat: Infinity,
      repeatDelay: 3,
    }}
    style={{ mixBlendMode: "overlay" }}
  />
</motion.div>


      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        Kterer Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
