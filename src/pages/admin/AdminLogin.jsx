import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/auth";
import LoginForm from "../../components/shared/LoginForm";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const data = await loginAdmin(credentials);
    localStorage.setItem("adminToken", data.token); // Save token
    navigate("/supervised"); // Redirect after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onSubmit={handleLogin} title="Admin Login" />
    </div>
  );
}
