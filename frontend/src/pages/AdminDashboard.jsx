import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  adminGetProducts, adminAddProduct, adminUpdateProduct,
  adminDeleteProduct, adminUpdateStock,
  adminGetOrders, adminUpdateOrderStatus,
  adminGetReports,
} from "../utils/adminApi";
import Toast from "../components/Toast";
import "../styles/Admin.css";

const STATUS_LIST = ["pending", "processing", "shipped", "delivered", "cancelled"];
const CATEGORIES  = ["suits", "2-piece", "3-piece", "winter", "jewelry"];
const SIZES_ALL   = ["XS", "S", "M", "L", "XL", "XXL"];

// ── Sub-components ────────────────────────────────────────────────────────────

const ProductModal = ({ product, onClose, onSave }) => {
  const blank = { name: "", price: "", category: "suits", description: "", stock: "", sizes: [], images: [], isNewArrival: false, isTrending: false };
  const [form, setForm] = useState(product ? { ...product, price: product.price, stock: product.stock } : blank);

  const toggle = (e) => setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const toggleSize = (s) => {
    const sizes = form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s];
    setForm({ ...form, sizes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{product ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="modal-field">
              <label>Product Name*</label>
              <input name="name" value={form.name} onChange={toggle} required />
            </div>
            <div className="modal-field">
              <label>Price (Rs)*</label>
              <input name="price" type="number" value={form.price} onChange={toggle} required min="0" />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Category*</label>
              <select name="category" value={form.category} onChange={toggle}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Stock*</label>
              <input name="stock" type="number" value={form.stock} onChange={toggle} required min="0" />
            </div>
          </div>
          <div className="modal-field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={toggle} />
          </div>
          <div className="modal-field">
            <label>Image URL</label>
            <input name="images" value={form.images?.[0] || ""} onChange={(e) => setForm({ ...form, images: [e.target.value] })} placeholder="https://..." />
          </div>
          <div className="modal-field">
            <label>Sizes</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
              {SIZES_ALL.map((s) => (
                <button key={s} type="button"
                  style={{ padding: "4px 12px", borderRadius: 4, border: "1px solid", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: form.sizes.includes(s) ? "#f3d9f8" : "#fff",
                    borderColor: form.sizes.includes(s) ? "#c77dcc" : "#ccc",
                    color: form.sizes.includes(s) ? "#c77dcc" : "#333" }}
                  onClick={() => toggleSize(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={toggle} />
              New Arrival
            </label>
            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" name="isTrending" checked={form.isTrending} onChange={toggle} />
              Trending
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose} style={{ padding: "9px 20px", fontSize: 13 }}>Cancel</button>
            <button type="submit" className="btn-purple" style={{ padding: "9px 20px", fontSize: 13 }}>
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────
const ProductsTab = ({ toast }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // null | "add" | product object

  const load = () => adminGetProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal === "add") await adminAddProduct(data);
      else await adminUpdateProduct(modal._id, data);
      toast("Saved successfully!", "success");
      setModal(null); load();
    } catch (err) { toast(err.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await adminDeleteProduct(id);
      toast("Product deleted", "default");
      load();
    } catch (err) { toast(err.message, "error"); }
  };

  const handleStockChange = async (id, val) => {
    try {
      await adminUpdateStock(id, Number(val));
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, stock: Number(val) } : p));
    } catch (err) { toast(err.message, "error"); }
  };

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Loading products...</div>;

  return (
    <>
      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      <button className="btn-add-product" onClick={() => setModal("add")}>
        + Add New Product
      </button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th style={{ width: 52 }}></th>
              <th>PRODUCT</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>DESCRIPTION</th>
              <th>SIZE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td style={{ color: "#aaa", fontSize: 16 }}>✕</td>
                <td>
                  <div className="admin-product-img">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : "📦"}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>Rs {p.price?.toLocaleString()}</td>
                <td>
                  <input type="number" value={p.stock} min="0" style={{ width: 60, padding: "4px 6px", border: "1px solid #ddd", borderRadius: 4, fontSize: 12, textAlign: "center" }}
                    onChange={(e) => handleStockChange(p._id, e.target.value)} />
                </td>
                <td style={{ maxWidth: 200, color: "#555" }}>{p.description?.slice(0, 50) || "—"}</td>
                <td>
                  <span className="size-pill">{p.sizes?.[0] || "—"}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-icon btn-icon--edit" title="Edit" onClick={() => setModal(p)}>✏️</button>
                    <button className="btn-icon btn-icon--delete" title="Delete" onClick={() => handleDelete(p._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
const OrdersTab = ({ toast }) => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("");

  const load = (status) =>
    adminGetOrders(status ? { status } : {})
      .then(setOrders).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(filter); }, [filter]);

  const handleStatus = async (orderId, status) => {
    try {
      await adminUpdateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      toast("Status updated", "success");
    } catch (err) { toast(err.message, "error"); }
  };

  const statusClass = (s) => {
    const map = { pending: "--pending", processing: "--processing", shipped: "--shipped", delivered: "--delivered", cancelled: "--cancelled" };
    return `status-badge${map[s] || "--pending"}`;
  };

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Loading orders...</div>;

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["", ...STATUS_LIST].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === s ? "#c77dcc" : "#fff",
              borderColor: filter === s ? "#c77dcc" : "#ccc",
              color: filter === s ? "#fff" : "#555" }}>
            {s || "All"}
          </button>
        ))}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>NAME</th><th>ADDRESS</th><th>DATE</th><th>PRODUCTS</th><th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o._id}>
                <td style={{ fontWeight: 600 }}>{String(i + 1).padStart(5, "0")}</td>
                <td>{o.user?.fullName || o.billingDetails?.firstName || "—"}</td>
                <td style={{ color: "#555", fontSize: 12 }}>
                  {o.billingDetails ? `${o.billingDetails.streetAddress || ""} ${o.billingDetails.city || ""}`.trim() : "—"}
                </td>
                <td style={{ fontSize: 12, color: "#888" }}>
                  {new Date(o.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
                </td>
                <td style={{ fontSize: 12, color: "#888" }}>
                  {o.items?.map((it) => it.name || it.product?.name || "Product").join(", ").slice(0, 40) || "—"}
                </td>
                <td>
                  <select className="status-select" value={o.status}
                    onChange={(e) => handleStatus(o._id, e.target.value)}>
                    {STATUS_LIST.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#aaa" }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Reports Tab ───────────────────────────────────────────────────────────────
const ReportsTab = () => {
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [month,   setMonth]   = useState(new Date().getMonth() + 1);
  const [year,    setYear]    = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    adminGetReports({ month, year })
      .then(setReport).catch(() => {}).finally(() => setLoading(false));
  }, [month, year]);

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Loading reports...</div>;
  if (!report)  return <div style={{ padding: 40, color: "#888" }}>No report data.</div>;

  const { summary, dailySales, topProducts } = report;
  const maxRevenue = Math.max(...(dailySales.map((d) => d.revenue)), 1);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <>
      {/* Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
          style={{ padding: "7px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
          style={{ padding: "7px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="reports-grid">
        <div className="report-card">
          <div>
            <p className="report-card__label">Total Orders Delivered</p>
            <p className="report-card__value">{summary.totalDelivered.toLocaleString()}</p>
            <p className="report-card__change">↑ Orders this period</p>
          </div>
          <div className="report-card__icon" style={{ background: "#fff3cd" }}>📦</div>
        </div>
        <div className="report-card">
          <div>
            <p className="report-card__label">Total Users</p>
            <p className="report-card__value">{summary.totalUsers.toLocaleString()}</p>
            <p className="report-card__change">↑ Registered users</p>
          </div>
          <div className="report-card__icon" style={{ background: "#e9d5ff" }}>👥</div>
        </div>
        <div className="report-card">
          <div>
            <p className="report-card__label">Total Pending Orders</p>
            <p className="report-card__value">{summary.totalPending.toLocaleString()}</p>
            <p className="report-card__change" style={{ color: "#f59e0b" }}>Needs attention</p>
          </div>
          <div className="report-card__icon" style={{ background: "#fed7aa" }}>⏳</div>
        </div>
      </div>

      {/* Revenue card */}
      <div className="report-card" style={{ marginBottom: 20 }}>
        <div>
          <p className="report-card__label">Total Revenue</p>
          <p className="report-card__value" style={{ color: "#c77dcc" }}>Rs. {summary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="report-card__icon" style={{ background: "#f3d9f8" }}>💰</div>
      </div>

      {/* Daily sales chart */}
      <div className="chart-card">
        <div className="chart-card__header">
          <p className="chart-card__title">Sales Details — {MONTHS[month - 1]} {year}</p>
        </div>
        {dailySales.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: 13, textAlign: "center", padding: 32 }}>No sales data for this period</p>
        ) : (
          <div className="chart-bar-wrap">
            {dailySales.map((d) => (
              <div key={d.date} className="chart-bar-col">
                <div className="chart-bar" style={{ height: `${Math.round((d.revenue / maxRevenue) * 100)}%` }}
                  title={`Rs. ${d.revenue.toLocaleString()}`} />
                <span className="chart-bar-label">{d.date.slice(8)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="chart-card">
          <p className="chart-card__title" style={{ marginBottom: 14 }}>Top Products by Revenue</p>
          <table className="top-products-table">
            <thead><tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.name}>
                  <td style={{ color: "#aaa", fontWeight: 700 }}>#{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.qty}</td>
                  <td style={{ color: "#c77dcc", fontWeight: 600 }}>Rs. {p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) navigate("/login");
  }, [user]);

  const showToast = (message, type = "default") => setToast({ message, type });

  return (
    <div className="admin-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top bar */}
      <div className="admin-topbar">
        <button className="admin-topbar__logout" onClick={() => { logout(); navigate("/login"); }}>
          Logout
        </button>
      </div>

      {/* Banner */}
      <div className="admin-banner">
        <p className="admin-banner__label">Shop</p>
        <h1 className="admin-banner__title">ADMIN DASHBOARD</h1>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 40px" }}>
        <div className="admin-tabs">
          {[
            { id: "products", icon: "📦", label: "Products" },
            { id: "orders",   icon: "🛒", label: "Orders" },
            { id: "reports",  icon: "📊", label: "Reports" },
          ].map((t) => (
            <button key={t.id} className={`admin-tab ${tab === t.id ? "admin-tab--active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        {tab === "products" && <ProductsTab toast={showToast} />}
        {tab === "orders"   && <OrdersTab   toast={showToast} />}
        {tab === "reports"  && <ReportsTab />}
      </div>
    </div>
  );
}

export default AdminDashboard;
