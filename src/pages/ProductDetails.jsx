import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getStoreSettings } from "../api/storeApi";
import WhatsAppButton from "../components/WhatsAppButton";


function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [storeSettings, setStoreSettings] = useState(null);

  useEffect(() => {
    getProductById(id).then((res) => setProduct(res.data));
    getStoreSettings().then((res) => setStoreSettings(res.data));
  }, [id]);

  if (!product) return (
    <p style={{ padding: "40px 24px", color: "var(--text-muted)" }}>جاري التحميل...</p>
  );

  return (
    <div className="product-details">
      <div className="product-details__images">
        {product.imageUrls?.length > 0 ? (
          product.imageUrls.map((url, i) => (
            <img key={i} src={url} alt={product.name} />
          ))
        ) : (
          <div style={{
            width: "240px", height: "240px", background: "#1e1e1e",
            borderRadius: "10px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "48px"
          }}>🔧</div>
        )}
      </div>

      <h1>{product.name}</h1>
      <div className="product-details__price">{product.price} ج.م</div>
      <span className={`stock-badge ${product.isAvailable ? "available" : "unavailable"}`}>
        {product.isAvailable ? `متوفر — ${product.stockQuantity} قطعة` : "غير متوفر حالياً"}
      </span>
      <p className="product-details__desc">{product.description}</p>

      {product.isAvailable && storeSettings && (
        <WhatsAppButton
          productName={product.name}
          productUrl={window.location.href}
          whatsAppNumber={storeSettings.whatsAppNumber}
        />
      )}
    </div>
  );
}

export default ProductDetails;
