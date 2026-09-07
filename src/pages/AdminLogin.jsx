import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginAdmin(username, password);
      login();
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.status === 429) {
        setError("محاولات كتير، استنى شوية وحاول تاني");
      } else {
        setError("بيانات الدخول غلط");
      }
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>لوحة <span>التحكم</span></h1>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "6px" }}>تسجيل الدخول</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>أدخل بياناتك للوصول للوحة التحكم</p>
          </div>
          <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", padding: "28px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary">دخول</button>
          </form>
        </div>
      </div>

      <footer className="store-footer">
        <p>لوحة تحكم المتجر</p>
      </footer>
    </div>
  );
}

export default AdminLogin;
