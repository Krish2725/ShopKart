import React from "react";

const CheckoutForm = ({ formData, errors, touched, onChange, onBlur }) => {
  return (
    <section className="checkout-card shipping-details-card" aria-labelledby="shipping-heading">
      <div className="card-header">
        <div className="card-header-icon">
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h2 id="shipping-heading" className="card-title">
            Shipping Details
          </h2>
          <p className="card-subtitle">Where should we deliver your order?</p>
        </div>
      </div>

      <div className="checkout-form-grid">
        {/* Full Name */}
        <div className={`checkout-form-group ${errors.fullName && touched.fullName ? "has-error" : ""}`}>
          <label htmlFor="fullName" className="checkout-label">
            Full Name <span className="required-star">*</span>
          </label>
          <div className="checkout-input-wrapper">
            <svg
              className="checkout-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="checkout-input"
              placeholder="e.g. Alex Morgan"
              value={formData.fullName}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="name"
              required
            />
          </div>
          {errors.fullName && touched.fullName && (
            <span className="checkout-error-msg">{errors.fullName}</span>
          )}
        </div>

        {/* Phone */}
        <div className={`checkout-form-group ${errors.phone && touched.phone ? "has-error" : ""}`}>
          <label htmlFor="phone" className="checkout-label">
            Phone <span className="required-star">*</span>
          </label>
          <div className="checkout-input-wrapper">
            <svg
              className="checkout-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="checkout-input"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="tel"
              maxLength={15}
              required
            />
          </div>
          {errors.phone && touched.phone && (
            <span className="checkout-error-msg">{errors.phone}</span>
          )}
        </div>

        {/* Address */}
        <div className={`checkout-form-group full-width ${errors.address && touched.address ? "has-error" : ""}`}>
          <label htmlFor="address" className="checkout-label">
            Address <span className="required-star">*</span>
          </label>
          <div className="checkout-input-wrapper">
            <svg
              className="checkout-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <input
              type="text"
              id="address"
              name="address"
              className="checkout-input"
              placeholder="e.g. Flat 402, Sunshine Apartments, 12th Main Road"
              value={formData.address}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="street-address"
              required
            />
          </div>
          {errors.address && touched.address && (
            <span className="checkout-error-msg">{errors.address}</span>
          )}
        </div>

        {/* City */}
        <div className={`checkout-form-group ${errors.city && touched.city ? "has-error" : ""}`}>
          <label htmlFor="city" className="checkout-label">
            City <span className="required-star">*</span>
          </label>
          <div className="checkout-input-wrapper">
            <svg
              className="checkout-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="9" y1="22" x2="9" y2="2" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
              <path d="M12 10h.01" />
              <path d="M12 14h.01" />
              <path d="M16 10h.01" />
              <path d="M16 14h.01" />
              <path d="M8 10h.01" />
              <path d="M8 14h.01" />
            </svg>
            <input
              type="text"
              id="city"
              name="city"
              className="checkout-input"
              placeholder="e.g. Bengaluru"
              value={formData.city}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="address-level2"
              required
            />
          </div>
          {errors.city && touched.city && (
            <span className="checkout-error-msg">{errors.city}</span>
          )}
        </div>

        {/* State */}
        <div className={`checkout-form-group ${errors.state && touched.state ? "has-error" : ""}`}>
          <label htmlFor="state" className="checkout-label">
            State <span className="required-star">*</span>
          </label>
          <div className="checkout-input-wrapper">
            <svg
              className="checkout-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <input
              type="text"
              id="state"
              name="state"
              className="checkout-input"
              placeholder="e.g. Karnataka"
              value={formData.state}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="address-level1"
              required
            />
          </div>
          {errors.state && touched.state && (
            <span className="checkout-error-msg">{errors.state}</span>
          )}
        </div>

        {/* Pincode */}
        <div className={`checkout-form-group ${errors.pincode && touched.pincode ? "has-error" : ""}`}>
          <label htmlFor="pincode" className="checkout-label">
            Pincode <span className="required-star">*</span>
          </label>
          <div className="checkout-input-wrapper">
            <svg
              className="checkout-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
            <input
              type="text"
              id="pincode"
              name="pincode"
              className="checkout-input"
              placeholder="e.g. 560001"
              value={formData.pincode}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="postal-code"
              maxLength={10}
              required
            />
          </div>
          {errors.pincode && touched.pincode && (
            <span className="checkout-error-msg">{errors.pincode}</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckoutForm;
