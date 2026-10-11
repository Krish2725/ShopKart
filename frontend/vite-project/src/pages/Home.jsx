import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axiosInstance from "../../axiosCalls/axios";

function Home() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [heroSearch, setHeroSearch] = useState("");
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const totalCartCount = (cartItems || []).reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );
  const wishlistCount = Array.isArray(user?.wishlist) ? user.wishlist.length : 0;

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/products");
      if (res.data?.success && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch featured products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/products");
    }
  };

  // Filter products for the showcase section
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const categories = [
    {
      name: "Electronics",
      desc: "Laptops, Audio, Wearables & Gadgets",
      badge: "Trending",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="17" />
        </svg>
      ),
    },
    {
      name: "Fashion",
      desc: "Men, Women, Seasonal Wear & Trends",
      badge: "Popular",
      gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      name: "Books",
      desc: "Bestsellers, Fiction & Growth Guides",
      badge: "Top Picks",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="home-wrapper">
      <Navbar />

      <style>{`
        .home-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          font-family: var(--font-main);
          color: var(--slate-800);
        }

        /* Hero Section */
        .home-hero {
          position: relative;
          background: linear-gradient(145deg, #090b16 0%, #121429 50%, #1c183a 100%);
          color: #ffffff;
          padding: 4.5rem 1.5rem 5rem;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.4);
        }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(75px);
          pointer-events: none;
          z-index: 0;
        }

        .hero-blob-1 {
          width: 450px;
          height: 450px;
          top: -120px;
          left: -80px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.35), transparent 70%);
        }

        .hero-blob-2 {
          width: 420px;
          height: 420px;
          bottom: -100px;
          right: -50px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent 70%);
        }

        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
          font-size: 0.85rem;
          font-weight: 600;
          color: #c7d2fe;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 3.4rem;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.03em;
          max-width: 850px;
          margin-bottom: 1.25rem;
        }

        .hero-title-highlight {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 680px;
          margin-bottom: 2.25rem;
        }

        /* Hero Quick Search */
        .hero-search-form {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 9999px;
          padding: 0.4rem 0.5rem 0.4rem 1.4rem;
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(99, 102, 241, 0.25);
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .hero-search-form:focus-within {
          box-shadow: 0 20px 45px -5px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(99, 102, 241, 0.6);
          transform: translateY(-2px);
        }

        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          color: #0f172a;
          background: transparent;
          font-family: inherit;
        }

        .hero-search-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
        }

        .hero-search-btn:hover {
          background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
          transform: scale(1.02);
        }

        /* Hero Action Buttons */
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2.75rem;
        }

        .btn-hero-primary {
          padding: 0.85rem 1.8rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.5);
          transition: all 0.25s ease;
        }

        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 25px -5px rgba(99, 102, 241, 0.65);
        }

        .btn-hero-secondary {
          padding: 0.85rem 1.8rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          transition: all 0.25s ease;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        /* Main Content Container */
        .home-main {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 2.5rem 1.5rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        /* Member Hub Card */
        .member-hub-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.04);
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .member-hub-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }

        .member-hub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .member-profile-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .member-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          color: #ffffff;
          font-weight: 800;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .member-name {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }

        .member-sub {
          font-size: 0.85rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* Hub Metrics Grid */
        .hub-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .hub-metric-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.15rem 1.25rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.25s ease;
        }

        .hub-metric-box:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        }

        .hub-metric-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .hub-metric-val {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 0.2rem;
        }

        .hub-metric-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Category Showcase */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }

        .section-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: gap 0.2s ease;
        }

        .section-link:hover {
          gap: 0.5rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .category-card {
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1.75rem 1.5rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .category-card:hover {
          transform: translateY(-6px);
          border-color: #cbd5e1;
          box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.1);
        }

        .category-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .category-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          background: #f1f5f9;
          color: #475569;
        }

        .category-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.35rem;
        }

        .category-desc {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .category-explore-btn {
          font-size: 0.85rem;
          font-weight: 700;
          color: #4f46e5;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* Filter Tabs */
        .category-tabs {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .category-tab-btn {
          padding: 0.5rem 1.15rem;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-tab-btn.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        .category-tab-btn:hover:not(.active) {
          background: #f1f5f9;
        }

        /* Featured Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        /* Footer */
        .home-footer {
          background: #090b16;
          color: #94a3b8;
          padding: 4rem 1.5rem 2.5rem;
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-brand-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-brand-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #64748b;
          max-width: 320px;
        }

        .footer-column h4 {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: #ffffff;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 2.6rem;
          }
          .hub-metrics-grid,
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .home-hero {
            padding: 3rem 1rem 3.5rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hub-metrics-grid,
          .categories-grid {
            grid-template-columns: 1fr;
          }
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      {/* Hero Showcase Section */}
      <section className="home-hero">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>

        <div className="hero-inner">
          <div className="hero-pill-badge">
            <span>✨</span> Next-Generation Online Shopping Experience
          </div>

          <h1 className="hero-title">
            Curated Collections,{" "}
            <span className="hero-title-highlight">Delivered To You.</span>
          </h1>

          <p className="hero-subtitle">
            Explore authentic electronics, stylish fashion, and bestselling books.
            Enjoy secure 1-click Razorpay checkout and doorstep delivery.
          </p>

          {/* Quick Search */}
          <form className="hero-search-form" onSubmit={handleHeroSearch}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "0.6rem" }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search products, brands, or categories..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </form>

          {/* Hero CTAs */}
          <div className="hero-actions" style={{ marginBottom: "0" }}>
            <Link to="/products" className="btn-hero-primary">
              <span>Explore All Products</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/wishlist" className="btn-hero-secondary">
              <span>Saved Items ({wishlistCount})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Home Sections */}
      <main className="home-main">
        {/* Logged In Member Activity Hub */}
        <section className="member-hub-card">
          <div className="member-hub-header">
            <div className="member-profile-info">
              <div className="member-avatar">
                {user?.fullName ? user.fullName[0].toUpperCase() : "M"}
              </div>
              <div>
                <div className="member-name">
                  Welcome back, {user?.fullName || "Valued Shopper"}!
                </div>
                <div className="member-sub">
                  <span>{user?.email || "Member Session Active"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAccountDetails(!showAccountDetails)}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#334155",
                cursor: "pointer",
              }}
            >
              {showAccountDetails ? "Hide Account Details" : "View Account Details"}
            </button>
          </div>

          {/* Collapsible Account Details */}
          {showAccountDetails && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "1.25rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>FULL NAME</div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{user?.fullName || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>REGISTERED EMAIL</div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{user?.email || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>CONTACT NUMBER</div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{user?.phone || "Not Provided"}</div>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="hub-metrics-grid">
            <Link to="/cart" className="hub-metric-box">
              <div>
                <div className="hub-metric-label">Shopping Cart</div>
                <div className="hub-metric-val">{totalCartCount} items</div>
              </div>
              <div className="hub-metric-icon" style={{ background: "#e0e7ff", color: "#4f46e5" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
            </Link>

            <Link to="/wishlist" className="hub-metric-box">
              <div>
                <div className="hub-metric-label">Wishlist</div>
                <div className="hub-metric-val">{wishlistCount} saved</div>
              </div>
              <div className="hub-metric-icon" style={{ background: "#fce7f3", color: "#db2777" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </Link>

            <Link to="/orders" className="hub-metric-box">
              <div>
                <div className="hub-metric-label">My Orders</div>
                <div className="hub-metric-val">Track & View</div>
              </div>
              <div className="hub-metric-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
            </Link>

            <Link to="/products" className="hub-metric-box">
              <div>
                <div className="hub-metric-label">Explore Catalog</div>
                <div className="hub-metric-val">{products.length} Products</div>
              </div>
              <div className="hub-metric-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
            </Link>
          </div>
        </section>

        {/* Shop By Category Section */}
        <section>
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">
                Explore our handpicked departments tailored for your needs
              </p>
            </div>
            <Link to="/products" className="section-link">
              <span>View All Categories</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="category-card"
              >
                <span className="category-badge">{cat.badge}</span>
                <div
                  className="category-icon-wrapper"
                  style={{ background: cat.gradient }}
                >
                  {cat.icon}
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
                <div className="category-explore-btn">
                  <span>Explore Collection</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section>
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Top rated picks with guaranteed best prices and fast shipping
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="category-tabs">
              {["All", "Electronics", "Fashion", "Books"].map((cat) => (
                <button
                  key={cat}
                  className={`category-tab-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
              <div
                className="spinner"
                style={{
                  margin: "0 auto 1rem",
                  width: "40px",
                  height: "40px",
                  borderWidth: "4px",
                  borderTopColor: "#4f46e5",
                }}
              ></div>
              <p style={{ fontWeight: 600 }}>Loading curated products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "#ffffff",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "1rem" }}>
                No products found in the "{selectedCategory}" category yet.
              </p>
              <Link to="/products" className="btn-hero-primary" style={{ fontSize: "0.9rem" }}>
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              to="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2rem",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                borderRadius: "14px",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s ease",
              }}
            >
              <span>View All {products.length} Products In Catalog</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Modern Comprehensive Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-title">
              <div
                className="brand-logo-icon"
                style={{ width: "28px", height: "28px" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <span>ShopKart</span>
            </div>
            <p className="footer-brand-desc">
              Your premier e-commerce destination for verified electronics, fashion, and books.
            </p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/orders">Order History</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Shop Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Fashion">Fashion</Link></li>
              <li><Link to="/products?category=Books">Books</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ShopKart Inc. All rights reserved. Built with Vite, React & Express.
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span>Secured by Razorpay</span>
            <span>•</span>
            <span>256-Bit SSL Encryption</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;