import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const mainImage = product.imageUrls?.[0];

  return (
    <Link
      to={`/product/${product.id}`}
      className={`product-card ${!product.isAvailable ? "out-of-stock" : ""}`}
    >
      <div className="product-card__image" style={{ position: "relative" }}>
        {mainImage ? (
          <img src={mainImage} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-card__image-placeholder">🔧</span>
        )}
        {!product.isAvailable && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: "800",
                fontSize: "16px",
                background: "var(--danger)",
                padding: "6px 14px",
                borderRadius: "6px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              نفد من المخزن
            </span>
          </div>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__price">{product.price} ج.م</div>
        <span
          className={`stock-badge ${product.isAvailable ? "available" : "unavailable"}`}
        >
          {product.isAvailable ? "متوفر" : "غير متاح"}
        </span>
      </div>
    </Link>
  );
}

export default ProductCard;
