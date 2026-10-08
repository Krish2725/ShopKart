import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../../axiosCalls/axios.js";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (val) => Number(val || 0).toLocaleString("en-IN");

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusMeta = {
    PLACED:          { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
    CONFIRMED:       { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
    SHIPPED:         { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
    DELIVERED:       { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    PENDING_PAYMENT: { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
    FAILED:          { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
  };

  return (
    <>
      <style>{`
        .mo-page {
          min-height: 100vh;
          background: #f4f6fb;
          display: flex;
          flex-direction: column;
        }
        .mo-container {
          flex: 1;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
          box-sizing: border-box;
        }
        /* Header */
        .mo-header {
          margin-bottom: 2rem;
        }
        .mo-title {
          font-family: "Outfit", sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.25rem;
          letter-spacing: -0.03em;
        }
        .mo-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }
        /* Order Card */
        .mo-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px -4px rgba(15,23,42,0.06);
          padding: 1.5rem 1.75rem;
          margin-bottom: 1.25rem;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          animation: moFadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .mo-card:hover {
          box-shadow: 0 10px 28px -6px rgba(15,23,42,0.12);
          transform: translateY(-2px);
        }
        /* Card Top Row */
        .mo-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .mo-order-id {
          font-size: 0.82rem;
          font-family: monospace;
          color: #64748b;
          font-weight: 600;
          margin: 0 0 0.2rem;
        }
        .mo-order-date {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .mo-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .mo-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        /* Items */
        .mo-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.1rem;
        }
        .mo-item-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #334155;
        }
        .mo-item-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 3px;
          flex-shrink: 0;
        }
        .mo-item-img-placeholder {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #e2e8f0;
          flex-shrink: 0;
        }
        .mo-item-name {
          font-weight: 600;
          color: #0f172a;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mo-item-qty {
          color: #64748b;
          white-space: nowrap;
        }
        .mo-more-items {
          font-size: 0.82rem;
          color: #94a3b8;
          font-style: italic;
          padding-left: 0.25rem;
        }
        /* Card Footer */
        .mo-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }
        .mo-total {
          font-size: 1.1rem;
          font-weight: 800;
          color: #4f46e5;
          font-family: "Outfit", sans-serif;
        }
        .mo-total-label {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 500;
          margin-right: 0.35rem;
        }
        .mo-view-btn {
          padding: 0.6rem 1.25rem;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .mo-view-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79,70,229,0.3);
        }
        /* Loading */
        .mo-state-box {
          text-align: center;
          padding: 4rem 2rem;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }
        .mo-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: moSpin 0.7s linear infinite;
          margin: 0 auto 1rem;
        }
        .mo-state-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem;
        }
        .mo-state-text {
          font-size: 0.92rem;
          color: #64748b;
          margin: 0 0 1.5rem;
        }
        .mo-shop-btn {
          padding: 0.8rem 1.75rem;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mo-shop-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(79,70,229,0.3);
        }
        /* Empty icon */
        .mo-empty-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 1.25rem;
          background: #eef2ff;
          color: #6366f1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Animations */
        @keyframes moSpin { to { transform: rotate(360deg); } }
        @keyframes moFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .mo-container { padding: 1.5rem 1rem 3rem; }
          .mo-card { padding: 1.25rem; }
          .mo-card-footer { flex-direction: column; align-items: flex-start; }
          .mo-view-btn { width: 100%; justify-content: center; }
          .mo-title { font-size: 1.6rem; }
        }
      `}</style>

      <div className="mo-page">
        <Navbar />
        <div className="mo-container">

          <div className="mo-header">
            <h1 className="mo-title">My Orders</h1>
            <p className="mo-subtitle">Your complete order history</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mo-state-box">
              <div className="mo-spinner" />
              <p style={{ color: "#64748b" }}>Loading your orders…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mo-state-box">
              <p className="mo-state-title" style={{ color: "#dc2626" }}>Something went wrong</p>
              <p className="mo-state-text">{error}</p>
              <button className="mo-shop-btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div className="mo-state-box">
              <div className="mo-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="mo-state-title">No orders yet</p>
              <p className="mo-state-text">You have not placed any orders yet.</p>
              <button className="mo-shop-btn" onClick={() => navigate("/products")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Start Shopping
              </button>
            </div>
          )}

          {/* Order Cards */}
          {!loading && !error && orders.length > 0 && orders.map((order, idx) => {
            const meta = statusMeta[order.status] || { bg: "#f1f5f9", color: "#334155", dot: "#94a3b8" };
            const visibleItems = order.items?.slice(0, 3) || [];
            const extraCount = (order.items?.length || 0) - visibleItems.length;

            return (
              <div
                key={order._id}
                className="mo-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {/* Top: ID + date + status */}
                <div className="mo-card-top">
                  <div>
                    <p className="mo-order-id">Order #{order._id}</p>
                    <p className="mo-order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className="mo-status-badge"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    <span className="mo-status-dot" style={{ background: meta.dot }} />
                    {order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="mo-items">
                  {visibleItems.map((item, i) => (
                    <div key={i} className="mo-item-row">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mo-item-img"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="mo-item-img-placeholder" />
                      )}
                      <span className="mo-item-name">{item.name}</span>
                      <span className="mo-item-qty">× {item.quantity}</span>
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <p className="mo-more-items">+{extraCount} more item{extraCount > 1 ? "s" : ""}</p>
                  )}
                </div>

                {/* Footer: total + view button */}
                <div className="mo-card-footer">
                  <div>
                    <span className="mo-total-label">Total</span>
                    <span className="mo-total">₹{formatPrice(order.totalAmount)}</span>
                  </div>
                  <button
                    className="mo-view-btn"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    View Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
};

export default Orders;
