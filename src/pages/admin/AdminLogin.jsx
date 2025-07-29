// src/pages/admin/AdminLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/adminAuth";
import LoginCard from "../../components/shared/loginCard";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleAdminLogin = async (credentials) => {
    const res = await loginUser({...credentials, role: "admin"});
    localStorage.setItem("authToken", res.token);
    navigate("/supervised");
  };

  return <LoginCard title="Admin Login" onSubmit={handleAdminLogin} />;
}
