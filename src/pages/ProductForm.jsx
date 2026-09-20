import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, getProductById } from "../api/storeApi";
import { createProduct, updateProduct, uploadImage } from "../api/adminApi";

function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
    if (isEditing) {
      getProductById(id).then((res) => {
        const p = res.data;
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setStockQuantity(p.stockQuantity);
        setCategoryId(p.categoryId || "");
        setExistingImageUrls(p.imageUrls || []);
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validation
    if (!name.trim()) {
      setError("اسم المنتج مطلوب");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("السعر لازم يكون أكبر من صفر");
      return;
    }
    if (!stockQuantity || Number(stockQuantity) < 0) {
      setError("الكمية لازم تكون صفر أو أكتر");
      return;
    }
    if (!categoryId) {
      setError("لازم تختار كاتيجوري");
      return;
    }

    setSaving(true);
    try {
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        const res = await uploadImage(file);
        uploadedUrls.push(res.data.imageUrl);
      }
      const payload = {
        name,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        categoryId: Number(categoryId),
        imageUrls: [...existingImageUrls, ...uploadedUrls],
      };
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/dashboard");
    } catch {
      setError("حصل خطأ أثناء الحفظ، حاول تاني");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>
          لوحة <span>التحكم</span>
        </h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn-secondary"
        >
          رجوع
        </button>
      </div>

      <div className="admin-content" style={{ maxWidth: "520px" }}>
        <h2 className="admin-page-title">
          {isEditing ? "تعديل منتج" : "إضافة منتج جديد"}
        </h2>

        <div
          style={{
            background: "var(--bg-card)",
            padding: "28px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: "block",
                color: "var(--text-muted)",
                fontSize: "12px",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              اسم المنتج
            </label>
            <input
              type="text"
              placeholder="مثال: زيت موتور توتال"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />

            <label
              style={{
                display: "block",
                color: "var(--text-muted)",
                fontSize: "12px",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              الوصف
            </label>
            <textarea
              placeholder="اكتب وصف المنتج..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  السعر (ج.م)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  min="1"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) setPrice(val);
                  }}
                  className="form-input"
                  style={{
                    borderColor:
                      error && (!price || Number(price) <= 0)
                        ? "var(--danger)"
                        : "",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  الكمية المتاحة
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={stockQuantity}
                  min="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) setStockQuantity(val);
                  }}
                  className="form-input"
                  style={{
                    borderColor:
                      error && !stockQuantity && stockQuantity !== 0
                        ? "var(--danger)"
                        : "",
                  }}
                />
              </div>
            </div>

            <label
              style={{
                display: "block",
                color: "var(--text-muted)",
                fontSize: "12px",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              الكاتيجوري
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-select"
            >
              <option value="">اختر الكاتيجوري</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {existingImageUrls.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                }}
              >
                {existingImageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  />
                ))}
              </div>
            )}

            <label
              style={{
                display: "block",
                color: "var(--text-muted)",
                fontSize: "12px",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              {isEditing ? "إضافة صور جديدة" : "صور المنتج"}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              style={{
                width: "100%",
                marginBottom: "16px",
                color: "var(--text-muted)",
                fontSize: "13px",
              }}
            />

            {error && <div className="form-error">{error}</div>}

            <button type="submit" disabled={saving} className="btn-primary">
              {saving
                ? "جاري الحفظ..."
                : isEditing
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
            </button>
          </form>
        </div>
      </div>

      <footer className="store-footer">
        <p>لوحة تحكم المتجر</p>
      </footer>
    </div>
  );
}

export default ProductForm;
