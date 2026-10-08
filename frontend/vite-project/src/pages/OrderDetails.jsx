import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../../axiosCalls/axios.js";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatPrice = (val) =>
    Number(val || 0).toLocaleString("en-IN");

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const statusColor = {
    PLACED: { bg: "#dcfce7", color: "#16a34a" },
    CONFIRMED: { bg: "#dbeafe", color: "#1d4ed8" },
    SHIPPED: { bg: "#fef3c7", color: "#d97706" },
    DELIVERED: { bg: "#d1fae5", color: "#065f46" },
    PENDING_PAYMENT: { bg: "#fef9c3", color: "#a16207" },
  };

  return (
    <>
      <style>{`
        .od-page-wrapper {
          min-height: 100vh;
          background: #f4f6fb;
          display: flex;
          flex-direction: column;
        }
        .od-container {
          flex: 1;
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
          box-sizing: border-box;
        }
        /* Success Banner */
        .od-success-banner {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px -5px rgba(15,23,42,0.07);
          padding: 2.5rem 2rem;
          text-align: center;
          margin-bottom: 1.75rem;
          animation: odFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        .od-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #dcfce7;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 0 0 12px rgba(220,252,231,0.45);
          animation: odPulse 2s infinite alternate;
        }
        .od-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
          font-family: "Outfit", sans-serif;
        }
        .od-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
        }
        /* Details Card */
        .od-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px -4px rgba(15,23,42,0.05);
          padding: 1.75rem 2rem;
          margin-bottom: 1.5rem;
          animation: odFadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .od-card-heading {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin: 0 0 1.1rem;
        }
        .od-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.65rem 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.93rem;
        }
        .od-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .od-row-label {
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }
        .od-row-val {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }
        .od-status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .od-total-val {
          font-size: 1.2rem;
          color: #4f46e5;
          font-weight: 800;
          font-family: "Outfit", sans-serif;
        }
        /* Items List */
        .od-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .od-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }
        .od-item-img {
          width: 52px;
          height: 52px;
          object-fit: contain;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 4px;
          flex-shrink: 0;
        }
        .od-item-img-placeholder {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          background: #e2e8f0;
          flex-shrink: 0;
        }
        .od-item-info {
          flex: 1;
          min-width: 0;
        }
        .od-item-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .od-item-meta {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.2rem;
        }
        .od-item-price {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
        }
        /* Actions */
        .od-actions {
          display: flex;
          gap: 1rem;
          animation: odFadeUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        .od-btn-primary {
          flex: 1;
          padding: 0.9rem 1.5rem;
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
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .od-btn-primary:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(79,70,229,0.3);
        }
        .od-btn-secondary {
          flex: 1;
          padding: 0.9rem 1.5rem;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .od-btn-secondary:hover {
          background: #e2e8f0;
        }
        /* Loading / Error States */
        .od-state-box {
          text-align: center;
          padding: 4rem 2rem;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }
        .od-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: odSpin 0.7s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes odSpin { to { transform: rotate(360deg); } }
        @keyframes odFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes odPulse {
          0%   { box-shadow: 0 0 0 12px rgba(220,252,231,0.45); }
          100% { box-shadow: 0 0 0 18px rgba(220,252,231,0.1); }
        }
        @media (max-width: 600px) {
          .od-container { padding: 1.5rem 1rem 3rem; }
          .od-success-banner { padding: 2rem 1.25rem; }
          .od-card { padding: 1.25rem 1.25rem; }
          .od-title { font-size: 1.55rem; }
          .od-actions { flex-direction: column; }
        }
      `}</style>

      <div className="od-page-wrapper">
        <Navbar />
        <div className="od-container">

          {loading && (
            <div className="od-state-box">
              <div className="od-spinner" />
              <p style={{ color: "#64748b" }}>Loading order details…</p>
            </div>
          )}

          {error && (
            <div className="od-state-box">
              <p style={{ color: "#dc2626", fontWeight: 600, marginBottom: "1rem" }}>{error}</p>
              <button className="od-btn-primary" style={{ width: "auto" }} onClick={() => navigate("/products")}>
                Continue Shopping
              </button>
            </div>
          )}

          {!loading && !error && order && (
            <>
              {/* ✅ Success Banner */}
              <div className="od-success-banner">
                <div className="od-icon-wrap">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h1 className="od-title">Order Placed Successfully!</h1>
                <p className="od-subtitle">
                  Thank you for shopping with ShopKart. Your order is confirmed.
                </p>
              </div>

              {/* Order Info */}
              <div className="od-card">
                <p className="od-card-heading">Order Details</p>

                <div className="od-row">
                  <span className="od-row-label">Order ID</span>
                  <span className="od-row-val" style={{ fontFamily: "monospace", fontSize: "0.88rem" }}>
                    {order._id}
                  </span>
                </div>

                <div className="od-row">
                  <span className="od-row-label">Order Date</span>
                  <span className="od-row-val">{formatDate(order.createdAt)}</span>
                </div>

                <div className="od-row">
                  <span className="od-row-label">Status</span>
                  <span
                    className="od-status-badge"
                    style={statusColor[order.status] || { bg: "#f1f5f9", color: "#334155" }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="od-row">
                  <span className="od-row-label">Total</span>
                  <span className="od-row-val od-total-val">₹{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="od-card">
                <p className="od-card-heading">Shipping Address</p>

                <div className="od-row">
                  <span className="od-row-label">Name</span>
                  <span className="od-row-val">{order.shippingAddress?.fullName}</span>
                </div>
                <div className="od-row">
                  <span className="od-row-label">Phone</span>
                  <span className="od-row-val">{order.shippingAddress?.phone}</span>
                </div>
                <div className="od-row">
                  <span className="od-row-label">Address</span>
                  <span className="od-row-val">
                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="od-card">
                <p className="od-card-heading">
                  Items Ordered ({order.items?.length})
                </p>
                <div className="od-items-list">
                  {order.items?.map((item, i) => (
                    <div key={i} className="od-item">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="od-item-img"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="od-item-img-placeholder" />
                      )}
                      <div className="od-item-info">
                        <div className="od-item-name">{item.name}</div>
                        <div className="od-item-meta">
                          ₹{formatPrice(item.price)} × {item.quantity}
                        </div>
                      </div>
                      <div className="od-item-price">
                        ₹{formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="od-actions">
                <button
                  className="od-btn-primary"
                  onClick={() => navigate("/products")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Continue Shopping
                </button>
                <button
                  className="od-btn-secondary"
                  onClick={() => navigate("/orders")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  View My Orders
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
