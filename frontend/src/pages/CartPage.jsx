import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Pages.css";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce((sum, c) => sum + (c.product?.price || 0) * c.quantity, 0);

  return (
    <div>
      <div className="page-banner">
        <p className="page-banner__label">Shop</p>
        <h1 className="page-banner__title">Your Cart</h1>
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>🏠 HOME</span>
          <span>›</span><span>CART</span>
        </div>
      </div>

      <div className="cart-page">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p style={{ fontSize: 40, marginBottom: 12 }}>🛒</p>
            <p>Your cart is empty.</p>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/catalogue")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item, i) => {
                const p = item.product;
                return (
                  <div key={i} className="cart-item">
                    <div className="cart-item__img" onClick={() => navigate(`/product/${p?._id}`)}>
                      {p?.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : p?.name || "Product"}
                    </div>
                    <div className="cart-item__info">
                      <p className="cart-item__name">{p?.name || "Product"}</p>
                      {item.size && <p className="cart-item__size">Size: {item.size}</p>}
                      <p className="cart-item__price">
                        Rs. {(p?.price || 0).toLocaleString()} × {item.quantity}
                        <span style={{ marginLeft: 8, fontWeight: 400, color: "#888", fontSize: 12 }}>
                          = Rs. {((p?.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeFromCart(p?._id, item.size)}>✕</button>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal ({cart.length} items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <button className="btn-purple cart-summary__btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout →
              </button>
              <button className="btn-outline cart-summary__btn" style={{ marginTop: 8 }} onClick={() => navigate("/catalogue")}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
