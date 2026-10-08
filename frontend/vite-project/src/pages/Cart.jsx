import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartLoading, cartError, refreshCart } = useCart();

  if (cartLoading) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <h1>My Cart</h1>
          <p>Loading your cart...</p>
        </div>
      </>
    );
  }

  if (cartError && cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <h1>My Cart</h1>
          <p>Unable to load your cart.</p>
          <button onClick={refreshCart}>Try Again</button>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "55vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "3rem 4rem",
              textAlign: "center",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f1f5f9",
              maxWidth: "520px",
              width: "100%",
            }}
          >
            {/* Cart Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 1.5rem",
                borderRadius: "50%",
                background: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
              </svg>
            </div>

            <h2
              style={{
                margin: "0 0 0.6rem",
                color: "#0f172a",
                fontSize: "1.6rem",
                fontWeight: "800",
              }}
            >
              Your cart is empty
            </h2>

            <p
              style={{
                margin: "0 auto 1.5rem",
                color: "#64748b",
                fontSize: "0.98rem",
                lineHeight: "1.6",
                maxWidth: "380px",
              }}
            >
              Looks like you haven't added anything yet. Explore our products
              and find something you'll love.
            </p>

            <button
              onClick={() => navigate("/products")}
              style={{
                border: "none",
                background: "#4f46e5",
                color: "#ffffff",
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#4338ca";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#4f46e5";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Browse Products
            </button>
          </div>
        </div>
      </>
    );
  }

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1>My Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p>Items: {totalItems}</p>
            <p>Subtotal: ₹{subtotal}</p>
            <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
