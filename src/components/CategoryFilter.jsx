function CategoryFilter({ categories, selectedCategory, onSelect }) {
  return (
    <div className="category-bar">
      <button
        className={`category-pill ${selectedCategory === null ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        الكل
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
