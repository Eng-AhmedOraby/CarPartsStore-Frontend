import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoreSettings } from "../api/storeApi";
import { updateStoreSettings } from "../api/adminApi";

function StoreSettingsForm() {
  const [storeName, setStoreName] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    getStoreSettings().then((res) => {
      const s = res.data;
      setStoreName(s.storeName || "");
      setWhatsAppNumber(s.whatsAppNumber || "");
      setAddress(s.address || "");
      setLatitude(s.latitude || "");
      setLongitude(s.longitude || "");
    });
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ text: "المتصفح ده مش بيدعم تحديد الموقع", type: "error" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setMessage({ text: "تم تحديد موقعك الحالي، متنساش تحفظ", type: "success" });
      },
      () => setMessage({ text: "تأكد إنك سمحت للمتصفح بالوصول للموقع", type: "error" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateStoreSettings({ storeName, whatsAppNumber, address, latitude: Number(latitude), longitude: Number(longitude) });
    setMessage({ text: "تم حفظ الإعدادات بنجاح", type: "success" });
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>لوحة <span>التحكم</span></h1>
        <button onClick={() => navigate("/admin/dashboard")} className="btn-secondary">رجوع</button>
      </div>

      <div className="admin-content" style={{ maxWidth: "520px" }}>
        <h2 className="admin-page-title">إعدادات المحل</h2>

        <div style={{ background: "var(--bg-card)", padding: "28px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>اسم المحل</label>
            <input type="text" placeholder="مثال: جنات الخير" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="form-input" />

            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>رقم الواتساب</label>
            <input type="text" placeholder="201xxxxxxxxx" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} className="form-input" />

            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>العنوان</label>
            <input type="text" placeholder="مثال: ش الجمهورية، الإسكندرية" value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" />

            <div style={{ background: "var(--bg-section)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)", marginBottom: "16px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px", fontWeight: "600" }}>موقع المحل على الخريطة</p>

              <button type="button" onClick={useCurrentLocation} className="btn-secondary" style={{ width: "100%", justifyContent: "center", marginBottom: "12px" }}>
                تحديد موقعي الحالي تلقائياً
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ display: "block", color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }}>خط العرض</label>
                  <input type="number" step="any" placeholder="30.0444" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="form-input" style={{ marginBottom: 0 }} />
                </div>
                <div>
                  <label style={{ display: "block", color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }}>خط الطول</label>
                  <input type="number" step="any" placeholder="31.2357" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="form-input" style={{ marginBottom: 0 }} />
                </div>
              </div>
            </div>

            {message.text && (
              <div style={{
                padding: "12px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px",
                background: message.type === "success" ? "var(--success-bg)" : "var(--danger-bg)",
                color: message.type === "success" ? "var(--success)" : "var(--danger)"
              }}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-primary">حفظ الإعدادات</button>
          </form>
        </div>
      </div>

      <footer className="store-footer"><p>لوحة تحكم المتجر</p></footer>
    </div>
  );
}

export default StoreSettingsForm;
