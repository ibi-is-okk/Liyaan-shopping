import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Pages.css";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <div className="order-success">
      <div className="order-success__icon">✅</div>
      <h2 className="order-success__title">ORDER PLACED!</h2>
      <p className="order-success__sub">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      {orderId && (
        <p className="order-success__id">Order ID: {orderId}</p>
      )}
      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-primary" onClick={() => navigate("/")}>Back to Home</button>
        <button className="btn-outline" onClick={() => navigate("/catalogue")}>Continue Shopping</button>
      </div>
    </div>
  );
}
