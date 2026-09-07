import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/storeApi";
import { deleteProduct } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const loadProducts = () => {
    setLoading(true);
    getProducts(null, 1)
      .then((res) => setProducts(res.data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("متأكد إنك عايز تحذف المنتج ده؟")) return;
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>
          لوحة <span>التحكم</span>
        </h1>
        <div className="admin-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            🏠 المتجر
          </a>
          <Link to="/admin/products/new" className="btn-secondary">
            + إضافة منتج
          </Link>
          <Link to="/admin/settings" className="btn-secondary">
            إعدادات المحل
          </Link>
          <button onClick={logout} className="btn-secondary">
            خروج
          </button>
        </div>
      </div>

      <div className="admin-content">
        <h2 className="admin-page-title">المنتجات ({products.length})</h2>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>جاري التحميل...</p>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>📦</p>
            <p>لا توجد منتجات بعد</p>
            <Link
              to="/admin/products/new"
              className="btn-primary"
              style={{
                display: "inline-block",
                marginTop: "16px",
                width: "auto",
                padding: "10px 24px",
              }}
            >
              أضف أول منتج
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>السعر</th>
                <th>الكمية</th>
                <th>الكاتيجوري</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: "600", color: "var(--white)" }}>
                    {p.name}
                  </td>
                  <td style={{ color: "var(--accent)", fontWeight: "700" }}>
                    {p.price} ج.م
                  </td>
                  <td>{p.stockQuantity}</td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {p.categoryName}
                  </td>
                  <td>
                    <span
                      className={`stock-badge ${p.isAvailable ? "available" : "unavailable"}`}
                    >
                      {p.isAvailable ? "متوفر" : "نفد"}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="btn-secondary"
                      >
                        تعديل
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn-danger"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer className="store-footer">
        <p>لوحة تحكم المتجر</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
