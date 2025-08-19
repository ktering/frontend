// src/pages/admin/AdminLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/adminAuth";
import LoginCard from "../../components/shared/loginCard";

export default function DriverLogin() {
  const navigate = useNavigate();
  const handleDriverLogin = async (credentials) => {
    const data = await loginUser({ ...credentials, role: "driver" });
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("role", "driver");
    localStorage.setItem("driverName", data.driverName);
    navigate("/driver");
  };

  return <LoginCard title="Driver Login" onSubmit={handleDriverLogin} />;
}
