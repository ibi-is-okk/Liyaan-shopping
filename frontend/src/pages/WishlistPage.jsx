import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../utils/api";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";
import "../styles/Pages.css";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getWishlist()
      .then(setWishlist)
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((p) => (p._id || p) !== productId));
      setToast({ message: "Removed from wishlist", type: "default" });
    } catch {
      setToast({ message: "Failed to remove", type: "error" });
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      setToast({ message: "Added to cart!", type: "success" });
    } catch {
      setToast({ message: "Failed to add to cart", type: "error" });
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-banner">
        <p className="page-banner__label">Shop</p>
        <h1 className="page-banner__title">WishList</h1>
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>🏠 HOME</span>
          <span>›</span><span>WISHLIST</span>
        </div>
      </div>

      <div className="wishlist-page">
        {loading ? (
          <div className="loading-spinner">Loading wishlist...</div>
        ) : wishlist.length === 0 ? (
          <div className="cart-empty">
            <p style={{ fontSize: 40, marginBottom: 12 }}>♡</p>
            <p>Your wishlist is empty.</p>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/catalogue")}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((p) => {
              const product = p._id ? p : p;
              const pid = product._id || product;
              return (
                <div key={pid} className="product-card">
                  <div className="product-card__img" onClick={() => navigate(`/product/${pid}`)}>
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : product.name || "Product"}
                  </div>
                  <div className="product-card__body">
                    <p className="product-card__name">{product.name || "Product"}</p>
                    <p className="product-card__price">Rs. {product.price || ""}</p>
                    <div className="product-card__btns">
                      <button className="btn-primary" onClick={() => handleAddToCart(pid)}>Add to Cart</button>
                      <button className="btn-outline" onClick={() => navigate(`/product/${pid}`)}>View Details</button>
                      <button className="btn-outline" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleRemove(pid)}>
                        Remove ♡
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
