import React from "react";

const OrderSummary = ({ items = [], total = 0, onPlaceOrder, isSubmitting = false }) => {
  // Format price helper with Indian Rupee formatting
  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString("en-IN");
  };

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  return (
    <section className="checkout-card order-summary-card" aria-labelledby="order-summary-heading">
      <div className="card-header">
        <div className="card-header-icon summary-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div>
          <h2 id="order-summary-heading" className="card-title">
            Order Summary
          </h2>
          <p className="card-subtitle">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in cart
          </p>
        </div>
      </div>

      {/* Item List */}
      <div className="order-items-list">
        {items.map((item, index) => {
          const product = item.product || {};
          const name = product.name || "Product";
          const quantity = Number(item.quantity) || 1;
          const price = Number(product.price) || 0;
          const itemTotal = price * quantity;

          return (
            <div key={product._id || `item-${index}`} className="order-item-row">
              <div className="order-item-info">
                {product.image && (
                  <img
                    src={product.image}
                    alt={name}
                    className="order-item-thumbnail"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="order-item-desc">
                  <span className="order-item-name-qty">
                    <span className="item-name">{name}</span>
                    <span className="item-times"> × </span>
                    <span className="item-qty">{quantity}</span>
                  </span>
                  <span className="order-item-unit-price">
                    ₹{formatPrice(price)} each
                  </span>
                </div>
              </div>

              <div className="order-item-price">
                ₹{formatPrice(itemTotal)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculation Breakdown */}
      <div className="order-cost-breakdown">
        <div className="cost-row">
          <span className="cost-label">Subtotal</span>
          <span className="cost-value">₹{formatPrice(total)}</span>
        </div>
        <div className="cost-row">
          <span className="cost-label">Estimated Delivery</span>
          <span className="cost-value free-delivery">FREE</span>
        </div>
        <div className="cost-row">
          <span className="cost-label">Taxes & Fees</span>
          <span className="cost-value">₹0</span>
        </div>

        <div className="cost-divider" />

        {/* Total */}
        <div className="cost-row total-row">
          <span className="total-label">Total</span>
          <span className="total-value">₹{formatPrice(total)}</span>
        </div>
      </div>

      {/* Place Order CTA */}
      <button
        type="button"
        id="place-order-button"
        className="btn-place-order"
        onClick={onPlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner" style={{ width: "18px", height: "18px" }} />
            <span>Processing Order...</span>
          </>
        ) : (
          <>
            <span>Place Order</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>

      {/* Trust Badges */}
      <div className="checkout-trust-badges">
        <div className="trust-badge-item">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>256-bit Bank-Grade Encryption</span>
        </div>
        <div className="trust-badge-item">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>ShopKart Buyer Guarantee</span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
