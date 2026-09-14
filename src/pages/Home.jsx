import { useEffect, useState, useCallback } from "react";
import { getProducts, getCategories, getStoreSettings } from "../api/storeApi";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import LocationButton from "../components/LocationButton";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
    getStoreSettings().then((res) => setStoreSettings(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(selectedCategory, page, search)
      .then((res) => {
        setProducts(res.data.items);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, page, search]);

  const storeName = storeSettings?.storeName || "متجرنا";
  const nameParts = storeName.split(" ");
  const firstWord = nameParts[0];
  const rest = nameParts.slice(1).join(" ");

  return (
    <div>
      <header className="store-header">
        <h1>{firstWord} {rest && <span>{rest}</span>}</h1>
        {storeSettings && (
          <LocationButton latitude={storeSettings.latitude} longitude={storeSettings.longitude} />
        )}
      </header>

      <div className="hero">
        <div className="hero__eyebrow">قطع غيار واكسسوارات أصلية</div>
        <h2>كل حاجة عربيتك<br />محتاجاها في مكان واحد</h2>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "16px 24px", background: "var(--bg-section)", borderBottom: "1px solid var(--border)" }}>
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="form-input"
          style={{ marginBottom: 0, maxWidth: "400px" }}
        />
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(id) => { setSelectedCategory(id); setPage(1); }}
      />

      {loading ? (
        <p style={{ padding: "32px 24px", color: "var(--text-muted)" }}>جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p style={{ padding: "32px 24px", color: "var(--text-muted)" }}>
          {search ? `مفيش نتائج لـ "${search}"` : "لا توجد منتجات حالياً"}
        </p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "24px" }}>
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>السابق</button>
          <span style={{ color: "var(--text-muted)", alignSelf: "center", fontSize: "14px" }}>{page} / {totalPages}</span>
          <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>التالي</button>
        </div>
      )}

      <footer className="store-footer">
        <p>{storeSettings?.storeName} — {storeSettings?.address}</p>
      </footer>
    </div>
  );
}

export default Home;