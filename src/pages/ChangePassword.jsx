import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/authApi";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ text: "كلمة المرور الجديدة مش متطابقة", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "كلمة المرور لازم تكون 6 حروف على الأقل", type: "error" });
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setMessage({ text: "تم تغيير كلمة المرور بنجاح", type: "success" });
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || "حصل خطأ، حاول تاني", 
        type: "error" 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>لوحة <span>التحكم</span></h1>
        <button onClick={() => navigate("/admin/dashboard")} className="btn-secondary">
          رجوع
        </button>
      </div>

      <div className="admin-content" style={{ maxWidth: "480px" }}>
        <h2 className="admin-page-title">تغيير كلمة المرور</h2>

        <div style={{ background: "var(--bg-card)", padding: "28px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>
              كلمة المرور الحالية
            </label>
            <input
              type="password"
              placeholder="ادخل كلمة المرور الحالية"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
            />

            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              placeholder="ادخل كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
            />

            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              placeholder="أعد كتابة كلمة المرور الجديدة"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />

            {message.text && (
              <div style={{
                padding: "12px 14px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
                background: message.type === "success" ? "var(--success-bg)" : "var(--danger-bg)",
                color: message.type === "success" ? "var(--success)" : "var(--danger)"
              }}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "جاري الحفظ..." : "تغيير كلمة المرور"}
            </button>
          </form>
        </div>
      </div>

      <footer className="store-footer"><p>لوحة تحكم المتجر</p></footer>
    </div>
  );
}

export default ChangePassword;