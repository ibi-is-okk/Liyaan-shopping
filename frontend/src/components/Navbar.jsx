import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
//import { useCart } from "../context/CartContext";
import { searchProducts } from "../utils/api";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  // const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const isDark = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    if (!searchTerm.trim()) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(searchTerm);
        setSuggestions(data.slice(0, 5));
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSuggestions([]);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
      setSearchTerm("");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isDark ? "navbar--dark" : ""}`}>
      <div onClick={() => navigate("/")} className="navbar__logo">
        <Logo color={isDark ? "#fff" : "#111"} />
      </div>

      {!isDark && (
        <div className="navbar__center">
          {[
            { label: "CATALOGUE", path: "/catalogue" },
            { label: "TRENDING",  path: "/trending" },
            { label: "WISHLIST",  path: "/wishlist" },
          ].map(({ label, path }) => (
            <Link key={label} to={path} className={`navbar__link ${isActive(path) ? "navbar__link--active" : ""}`}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <div className="navbar__right">
        {!isDark && user && (
          <div className="navbar__search-wrap" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                className="navbar__search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            {suggestions.length > 0 && (
              <ul className="navbar__suggestions">
                {suggestions.map((p) => (
                  <li key={p._id} onClick={() => { navigate(`/product/${p._id}`); setSuggestions([]); setSearchTerm(""); }}>
                    {p.name} — Rs. {p.price}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!isDark && user && (
          <button className="navbar__cart-btn" onClick={() => navigate("/cart")}>
            🛒
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </button>
        )}

        {!isDark && !user && (
          <>
            <Link to="/login"  className="navbar__link">Login</Link>
            <button className="navbar__btn" onClick={() => navigate("/signup")}>SIGN UP</button>
          </>
        )}

        {!isDark && user && (
          <button className="navbar__btn" onClick={logout}>LOGOUT</button>
        )}

        {isDark && (
          <button className="navbar__btn--outline" onClick={() => navigate(location.pathname === "/login" ? "/signup" : "/login")}>
            {location.pathname === "/login" ? "SIGN UP" : "LOG IN"}
          </button>
        )}
      </div>
    </nav>
  );
}
