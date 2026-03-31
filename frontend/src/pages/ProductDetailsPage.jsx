import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getReviews, addReview, addToWishlist, removeFromWishlist, getWishlist } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";
import "../styles/ProductDetail.css";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");
  const [inWishlist, setInWishlist] = useState(false);
  const [toast, setToast] = useState(null);

  // Review form
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => navigate("/catalogue"));
    getReviews(id).then(setReviews).catch(() => {});
    if (user) {
      getWishlist().then((wl) => {
        setInWishlist(wl.some((p) => (p._id || p) === id));
      }).catch(() => {});
    }
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToCart(id, 1, selectedSize);
      setToast({ message: "Added to cart!", type: "success" });
    } catch {
      setToast({ message: "Failed to add to cart", type: "error" });
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
        setToast({ message: "Removed from wishlist", type: "default" });
      } else {
        await addToWishlist(id);
        setInWishlist(true);
        setToast({ message: "Added to wishlist!", type: "success" });
      }
    } catch {
      setToast({ message: "Action failed", type: "error" });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!rating) { setToast({ message: "Please select a star rating", type: "error" }); return; }
    setSubmitting(true);
    try {
      const review = await addReview({ productId: id, rating, comment });
      setReviews((prev) => [review, ...prev]);
      setRating(0); setComment("");
      setToast({ message: "Review submitted!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return <div className="loading-spinner">Loading product...</div>;

  const images = product.images?.length ? product.images : [];

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-banner">
        <p className="page-banner__label">Shop</p>
        <h1 className="page-banner__title">Product Details</h1>
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>🏠 HOME</span>
          <span>›</span>
          <span onClick={() => navigate("/catalogue")}>CATALOGUE</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="product-detail">
        <div className="product-detail__header">
          <h2 className="product-detail__heading">New Arrival</h2>
        </div>

        <div className="product-detail__card">
          {/* Gallery */}
          <div className="gallery">
            <div className="gallery__thumbs">
              {images.length > 0
                ? images.map((img, i) => (
                    <div key={i} className={`gallery__thumb ${activeThumb === i ? "gallery__thumb--active" : ""}`} onClick={() => setActiveThumb(i)}>
                      <img src={img} alt={`thumb-${i}`} />
                    </div>
                  ))
                : ["Front", "Back", "Detail", "Style"].map((t, i) => (
                    <div key={t} className={`gallery__thumb ${activeThumb === i ? "gallery__thumb--active" : ""}`} onClick={() => setActiveThumb(i)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#9b59b6", fontWeight: 600 }}>
                      {t}
                    </div>
                  ))}
            </div>
            <div className="gallery__main">
              {images[activeThumb] ? <img src={images[activeThumb]} alt={product.name} /> : product.name}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="product-info__name">{product.name}</h3>
            <div className="product-info__meta">
              <span className="product-info__price">Rs. {product.price?.toLocaleString()}</span>
              <span className="product-info__stock">
                {product.stock > 0 ? `${product.stock} left in stock` : "Out of stock"}
                {product.rating > 0 && ` ⭐ ${product.rating}`}
              </span>
            </div>

            <div className="size-selector">
              {(product.sizes?.length ? product.sizes : SIZES).map((s) => (
                <button key={s} className={`size-btn ${selectedSize === s ? "size-btn--active" : ""}`} onClick={() => setSelectedSize(s)}>{s}</button>
              ))}
            </div>

            <div className="product-desc">
              <strong>DESCRIPTION</strong>
              <p>{product.description || "Premium quality fabric. Comfortable fit for all occasions."}</p>
              <p style={{ marginTop: 6 }}>Category: {product.category}</p>
            </div>

            <div className="product-actions">
              <button className="btn-cart" onClick={handleAddToCart} disabled={product.stock === 0}>
                🛒 Add to cart
              </button>
              <button className={`btn-wishlist ${inWishlist ? "btn-wishlist--active" : ""}`} onClick={handleWishlist}>
                {inWishlist ? "♥" : "♡"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews">
          <h3 className="reviews__title">Product Reviews</h3>
          <p className="reviews__subtitle">Review Lists</p>

          {reviews.map((r) => (
            <div key={r._id} className="review-item">
              <div className="review-item__left">
                <div className="review-avatar">{r.userName?.[0]?.toUpperCase() || "U"}</div>
                <div>
                  <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p className="review-text">{r.comment}</p>
                  <p className="review-name">{r.userName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && <p style={{ fontSize: 13, color: "#888", padding: "12px 0" }}>No reviews yet. Be the first!</p>}

          {/* Add review form */}
          {user && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h4>Write a Review</h4>
              <div className="star-input">
                {[1,2,3,4,5].map((s) => (
                  <span key={s}
                    style={{ color: s <= (hoverRating || rating) ? "#f5c518" : "#ccc" }}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}>★</span>
                ))}
              </div>
              <textarea placeholder="Share your experience with this product..." value={comment} onChange={(e) => setComment(e.target.value)} required />
              <button className="btn-purple" type="submit" disabled={submitting} style={{ padding: "9px 24px", fontSize: 13 }}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
          {!user && <p style={{ fontSize: 12, color: "#888", marginTop: 12 }}>
            <span style={{ color: "#9b59b6", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span> to write a review.
          </p>}
        </div>
      </div>
    </div>
  );
}
