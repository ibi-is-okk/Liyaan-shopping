import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNewArrivals } from "../utils/api";
import "../styles/Home.css";

const FAVOURITES = [
  { name: "Trending", tag: "Explore Now!", path: "/trending" },
  { name: "All Under Rs. 4000", tag: "Explore Now!", path: "/catalogue" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [arrivals, setArrivals] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getNewArrivals()
      .then(setArrivals)
      .catch(() => setArrivals([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            LET'S EXPLORE <span className="hero__highlight">UNIQUE</span> CLOTHES.
          </h1>
          <p className="hero__subtitle">Live for influential and innovative fashion!</p>
          <button className="btn-primary" onClick={() => navigate("/catalogue")}>Shop Now</button>
        </div>
        <div className="hero__img" />
      </section>

      <div className="accent-bar" />

      {/* New Arrivals */}
      <section className="home-section">
        <h2 className="section-title">NEW ARRIVALS</h2>
        <div className="arrivals-grid">
          {arrivals.length > 0
            ? arrivals.map((p) => (
                <div key={p._id} className="arrival-card" onClick={() => navigate(`/product/${p._id}`)}>
                  <div className="arrival-card__img">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : p.name}
                  </div>
                  <div className="arrival-card__footer">
                    <div>
                      <p className="arrival-card__name">{p.name}</p>
                      <p className="arrival-card__tag">Explore Now!</p>
                    </div>
                    <span>→</span>
                  </div>
                </div>
              ))
            : ["Embroided 2 Piece", "3 Piece Dresses", "Winter"].map((name) => (
                <div key={name} className="arrival-card" onClick={() => navigate("/catalogue")}>
                  <div className="arrival-card__img">{name}</div>
                  <div className="arrival-card__footer">
                    <div>
                      <p className="arrival-card__name">{name}</p>
                      <p className="arrival-card__tag">Explore Now!</p>
                    </div>
                    <span>→</span>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Payday Sale */}
      <section className="sale-banner">
        <div className="sale-banner__img" />
        <div className="sale-banner__content">
          <h2 className="sale-banner__title">PAYDAY<br />SALE NOW</h2>
          <p className="sale-banner__desc">Spend minimal Rs. 5000 get 30% off voucher code for your next purchase</p>
          <p className="sale-banner__dates">1 June – 10 June 2025<br /><span style={{ fontWeight: 400 }}>*Terms & Conditions apply</span></p>
          <button className="btn-primary" onClick={() => navigate("/catalogue")}>SHOP NOW</button>
        </div>
      </section>

      {/* Young's Favourite */}
      <section className="home-section">
        <h2 className="favourites-title">Young's <span className="favourites-cursive">Favourite</span></h2>
        <div className="favourites-grid">
          {FAVOURITES.map((item) => (
            <div key={item.name} className="arrival-card" onClick={() => navigate(item.path)}>
              <div className="arrival-card__img" style={{ height: 220 }}>{item.name}</div>
              <div className="arrival-card__footer">
                <div>
                  <p className="arrival-card__name">{item.name}</p>
                  <p className="arrival-card__tag">{item.tag}</p>
                </div>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2 className="newsletter__title">JOIN SHOPPING COMMUNITY TO GET MONTHLY PROMO</h2>
        <p className="newsletter__subtitle">Type your email down below and be young wild generation.</p>
        <div className="newsletter__form">
          <input className="newsletter__input" type="email" placeholder="Add your email here" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="newsletter__btn">SEND</button>
        </div>
      </section>
    </div>
  );
}
