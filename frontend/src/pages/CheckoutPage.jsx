import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../utils/api";
import { useCart } from "../context/CartContext";
import "../styles/Pages.css";

const EMPTY = { firstName: "", lastName: "", company: "", country: "", streetAddress: "", city: "", state: "", phone: "", email: "", notes: "" };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const [billing, setBilling] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, c) => sum + (c.product?.price || 0) * c.quantity, 0);

  const handleChange = (e) => setBilling({ ...billing, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await placeOrder({ billingDetails: billing });
      setCart([]);
      navigate("/order-success", { state: { orderId: res.order._id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="order-success">
        <p className="order-success__icon">🛒</p>
        <h2 className="order-success__title">Cart is Empty</h2>
        <button className="btn-primary" onClick={() => navigate("/catalogue")}>Shop Now</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-banner">
        <p className="page-banner__label">Shop</p>
        <h1 className="page-banner__title">Checkout</h1>
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>🏠 HOME</span>
          <span>›</span>
          <span onClick={() => navigate("/cart")}>CART</span>
          <span>/</span>
          <span>CHECKOUT</span>
        </div>
      </div>

      <div className="checkout-page">
        {error && <div className="auth-error" style={{ maxWidth: 900, margin: "0 auto 16px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-card">
              <h3 className="checkout-card__title">Billing Details</h3>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>First Name*</label>
                  <input name="firstName" placeholder="First Name" value={billing.firstName} onChange={handleChange} required />
                </div>
                <div className="checkout-field">
                  <label>Last Name*</label>
                  <input name="lastName" placeholder="Last Name" value={billing.lastName} onChange={handleChange} required />
                </div>
              </div>
              {[
                { name: "company",       label: "Company Name (optional)" },
                { name: "country",       label: "Country / Region*",    required: true },
                { name: "streetAddress", label: "Street Address*",      required: true },
                { name: "city",          label: "Town / City*",         required: true },
                { name: "state",         label: "State*",               required: true },
                { name: "phone",         label: "Phone*",               required: true },
                { name: "email",         label: "Email Address*",       required: true },
              ].map((f) => (
                <div key={f.name} className="checkout-field">
                  <label>{f.label}</label>
                  <input name={f.name} placeholder={f.label.replace("*","")} value={billing[f.name]} onChange={handleChange} required={f.required} />
                </div>
              ))}
              <div className="checkout-field">
                <label>Order Notes (optional)</label>
                <textarea name="notes" placeholder="Notes about your order" value={billing.notes} onChange={handleChange} />
              </div>
            </div>

            <div className="order-summary-card">
              <h3 className="order-summary-card__title">Your Order</h3>
              <table className="order-table">
                <thead><tr><th>Product</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={i}>
                      <td>{item.product?.name} ×{item.quantity}{item.size ? ` (${item.size})` : ""}</td>
                      <td>Rs. {((item.product?.price || 0) * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="order-totals">
                <div className="order-totals__row"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
                <div className="order-totals__row order-totals__row--bold"><span>Total</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              </div>
              <div className="coupon-bar">Have a coupon? Click here to enter your coupon code</div>
              <button className="btn-place-order" type="submit" disabled={loading}>
                {loading ? "Placing Order..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
