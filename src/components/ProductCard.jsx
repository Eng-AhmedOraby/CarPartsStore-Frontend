import { Link } from "react-router-dom";


function ProductCard({ product }) {
  const mainImage = product.imageUrls?.[0];

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image">
        {mainImage ? (
          <img src={mainImage} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-card__image-placeholder">🔧</span>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__price">{product.price} ج.م</div>
        {product.isAvailable ? (
          <span className="stock-badge available">متوفر</span>
        ) : (
          <span className="stock-badge unavailable">غير متوفر</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
