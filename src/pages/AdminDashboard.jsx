import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../api/storeApi";
import { deleteProduct, createCategory } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const { logout } = useAuth();

  const loadProducts = (searchVal = "") => {
    setLoading(true);
    getProducts(null, 1, searchVal)
      .then((res) => setProducts(res.data.items))
      .finally(() => setLoading(false));
  };

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("متأكد إنك عايز تحذف المنتج ده؟")) return;
    await deleteProduct(id);
    loadProducts(search);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await createCategory({ name: newCategory });
    setNewCategory("");
    loadCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("متأكد؟ مش هتقدر تحذف كاتيجوري فيها منتجات")) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "مش قادر تحذف الكاتيجوري دي");
    }
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
          <Link to="/admin/change-password" className="btn-secondary">
            🔑 الباسورد
          </Link>

          <button onClick={logout} className="btn-secondary">
            خروج
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "24px",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "0",
          }}
        >
          {["products", "categories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                color:
                  activeTab === tab ? "var(--accent)" : "var(--text-muted)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                marginBottom: "-1px",
              }}
            >
              {tab === "products"
                ? `المنتجات (${products.length})`
                : `الكاتيجوريز (${categories.length})`}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ maxWidth: "360px", marginBottom: "16px" }}
            />

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
                <p>
                  {search ? `مفيش نتائج لـ "${search}"` : "لا توجد منتجات بعد"}
                </p>
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
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <>
            <form
              onSubmit={handleAddCategory}
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              <input
                type="text"
                placeholder="اسم الكاتيجوري الجديدة"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-input"
                style={{ marginBottom: 0, maxWidth: "300px" }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "auto", padding: "10px 20px" }}
              >
                + إضافة
              </button>
            </form>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>اسم الكاتيجوري</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: "var(--white)", fontWeight: "600" }}>
                      {c.name}
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
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
          </>
        )}
      </div>

      <footer className="store-footer">
        <p>لوحة تحكم المتجر</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
