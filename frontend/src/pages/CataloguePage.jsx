import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";
import "../styles/Catalogue.css";
import "../styles/global.css";

const SORT_OPTIONS = [
  { label: "Alphabetical: A to Z", value: "name_asc" },
  { label: "Alphabetical: Z to A", value: "name_desc" },
  { label: "Price: Low to High",   value: "price_asc" },
  { label: "Price: High to Low",   value: "price_desc" },
];

const CATEGORIES = ["jewelry", "suits", "2-piece", "3-piece", "winter", "trending"];

export default function CataloguePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("name_asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [toast, setToast] = useState(null);

  const jewelryRef = useRef(null);
  const suitsRef   = useRef(null);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, sortBy, search })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sortBy, search]);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart(productId, 1);
      setToast({ message: "Added to cart!", type: "success" });
    } catch {
      setToast({ message: "Failed to add to cart", type: "error" });
    }
  };

  const jewelry = products.filter((p) => p.category === "jewelry");
  const suits    = products.filter((p) => p.category === "suits" || p.category === "2-piece" || p.category === "3-piece");
  const others   = products.filter((p) => !["jewelry","suits","2-piece","3-piece"].includes(p.category));

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sort by";

  return (
    <div className="catalogue-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-banner">
        <p className="page-banner__label">Shop</p>
        <h1 className="page-banner__title">Catalogue</h1>
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>🏠 HOME</span>
          <span>›</span><span>CATALOGUE</span>
        </div>
      </div>

      <div className="catalogue-controls">
        <button className="catalogue-controls__filter">⚙ Filter</button>
        <select className="catalogue-controls__select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          style={{ flex: 1, padding: "7px 14px", border: "1px solid #ccc", borderRadius: 4, fontSize: 13 }}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="catalogue-controls__sort-wrap">
          <button className="catalogue-controls__sort" onClick={() => setSortOpen(!sortOpen)}>
            ⇅ {sortLabel}
          </button>
          {sortOpen && (
            <div className="sort-dropdown">
              {SORT_OPTIONS.map((opt) => (
                <div key={opt.value}
                  className={`sort-dropdown__item ${sortBy === opt.value ? "sort-dropdown__item--active" : ""}`}
                  onClick={() => { setSortBy(opt.value); setSortOpen(false); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="catalogue-empty">No products found.</div>
      ) : (
        <>
          {/* Jewelry */}
          {(jewelry.length > 0 || !category) && (
            <div className="catalogue-section" ref={jewelryRef} id="jewelry">
              <button
                className="catalogue-section__label"
                onClick={() => suitsRef.current?.scrollIntoView({ behavior: "smooth" })}>
                Go to Suits ↓
              </button>
              <div className="catalogue-grid">
                {jewelry.map((p) => <ProductCard key={p._id} product={p} navigate={navigate} onAddToCart={handleAddToCart} />)}
              </div>
            </div>
          )}

          {/* Others */}
          {others.length > 0 && (
            <div className="catalogue-section">
              <div className="catalogue-grid">
                {others.map((p) => <ProductCard key={p._id} product={p} navigate={navigate} onAddToCart={handleAddToCart} />)}
              </div>
            </div>
          )}

          {/* Suits */}
          {(suits.length > 0 || !category) && (
            <div className="catalogue-section" ref={suitsRef} id="suits">
              <button
                className="catalogue-section__label"
                onClick={() => jewelryRef.current?.scrollIntoView({ behavior: "smooth" })}>
                Go to Jewelry ↑
              </button>
              <div className="catalogue-grid">
                {suits.map((p) => <ProductCard key={p._id} product={p} navigate={navigate} onAddToCart={handleAddToCart} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductCard({ product, navigate, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-card__img" onClick={() => navigate(`/product/${product._id}`)}>
        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : product.name}
      </div>
      <div className="product-card__body">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__price">Rs. {product.price}</p>
        <div className="product-card__btns">
          <button className="btn-outline" onClick={() => navigate(`/product/${product._id}`)}>View Details</button>
          <button className="btn-primary" onClick={(e) => onAddToCart(e, product._id)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
