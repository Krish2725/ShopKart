import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../../axiosCalls/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, checkAuth } = useAuth();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const isProductInWishlist = Boolean(
    user?.wishlist?.some((item) => {
      const wishId = item?._id || item;
      return wishId && wishId.toString() === id?.toString();
    })
  );

  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist);
  const [isSaving, setIsSaving] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  // Check whether this product is already in the cart
  const isInCart = cartItems?.some((item) => {
    const cartProductId = item?.product?._id || item?.product;

    return (
      cartProductId &&
      cartProductId.toString() === product?._id?.toString()
    );
  });

  useEffect(() => {
    setIsWishlisted(isProductInWishlist);
  }, [isProductInWishlist]);

  useEffect(() => {
    if (wishlistError) {
      const timer = setTimeout(() => setWishlistError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [wishlistError]);

  const handleAddToCart = async () => {
    if (addingToCart || !product || product.stock <= 0) return;

    setAddingToCart(true);

    try {
      await addToCart(product._id);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) return;

    setIsSaving(true);
    setWishlistError("");

    try {
      if (!isWishlisted) {
        const response = await axiosInstance.post(`/wishlist/${id}`);

        if (
          response.status === 200 ||
          response.status === 201 ||
          response.data?.success
        ) {
          setIsWishlisted(true);

          if (checkAuth) {
            checkAuth();
          }
        } else {
          setWishlistError(
            response.data?.message || "Failed to add to wishlist."
          );
        }
      } else {
        const response = await axiosInstance.delete(`/wishlist/${id}`);

        if (response.status === 200 || response.data?.success) {
          setIsWishlisted(false);

          if (checkAuth) {
            checkAuth();
          }
        } else {
          setWishlistError(
            response.data?.message || "Failed to remove from wishlist."
          );
        }
      }
    } catch (err) {
      console.error("Wishlist error in ProductDetails:", err);

      if (err.response?.status === 401) {
        setWishlistError(
          "Please log in to add items to your wishlist."
        );
      } else if (err.response?.data?.message) {
        setWishlistError(err.response.data.message);
      } else if (err.request) {
        setWishlistError(
          "Network error: Unable to connect to server."
        );
      } else {
        setWishlistError(
          "Failed to update wishlist. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(`/products/${id}`);

      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        setError("Something went wrong while loading products.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No products found.");
      } else {
        setError("Something went wrong while loading products.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f4f6fb",
      }}
    >
      <Navbar />

      <div
        style={{
          flex: 1,
          padding: "3rem 2rem",
          maxWidth: "1000px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <button
          onClick={() => navigate("/products")}
          style={{
            marginBottom: "2rem",
            padding: "0.5rem 1rem",
            background: "transparent",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "600",
            color: "#475569",
          }}
        >
          &larr; Back to Products
        </button>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "4rem",
              fontSize: "1.25rem",
              color: "#64748b",
            }}
          >
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

            Loading products...
          </div>
        ) : error ? (
          <div
            style={{
              color: "#ef4444",
              textAlign: "center",
              background: "#fef2f2",
              padding: "2rem",
              borderRadius: "12px",
              border: "1px solid #f87171",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        ) : !product ? (
          <div
            style={{
              textAlign: "center",
              color: "#64748b",
              marginTop: "2rem",
              fontSize: "1.2rem",
            }}
          >
            No products found.
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            {/* Product Image */}
            <div
              style={{
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                padding: "2rem",
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span
                  style={{
                    color: "#94a3b8",
                    fontWeight: "600",
                    fontSize: "1.5rem",
                  }}
                >
                  PRODUCT IMAGE
                </span>
              )}
            </div>

            {/* Product Details */}
            <div style={{ padding: "3rem" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#e0e7ff",
                  color: "#4338ca",
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  marginBottom: "1.5rem",
                }}
              >
                {product.category}
              </div>

              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0 0 1rem",
                  color: "#0f172a",
                  lineHeight: "1.2",
                  letterSpacing: "-0.03em",
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  ₹
                  {product.price?.toLocaleString("en-IN") ||
                    product.price}
                </span>
              </div>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#64748b",
                  lineHeight: "1.6",
                  marginBottom: "2rem",
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  color:
                    product.stock > 0 ? "#10b981" : "#ef4444",
                  marginBottom: "2.5rem",
                  fontWeight: "600",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      product.stock > 0 ? "#10b981" : "#ef4444",
                    marginRight: "8px",
                  }}
                ></span>

                {product.stock > 0
                  ? `${product.stock} units left in stock`
                  : "Out of stock"}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {/* Add To Cart / Add Another */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    addingToCart || product.stock <= 0
                  }
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background:
                      product.stock > 0
                        ? "#4f46e5"
                        : "#cbd5e1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    cursor:
                      addingToCart || product.stock <= 0
                        ? "not-allowed"
                        : "pointer",
                    transition:
                      "background 0.2s, transform 0.1s",
                  }}
                  onMouseOver={(e) => {
                    if (
                      product.stock > 0 &&
                      !addingToCart
                    ) {
                      e.target.style.background = "#4338ca";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (product.stock > 0) {
                      e.target.style.background = "#4f46e5";
                    }
                  }}
                  onMouseDown={(e) => {
                    if (
                      product.stock > 0 &&
                      !addingToCart
                    ) {
                      e.target.style.transform = "scale(0.98)";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (
                      product.stock > 0 &&
                      !addingToCart
                    ) {
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {addingToCart
                    ? "Adding..."
                    : product.stock <= 0
                      ? "Out of Stock"
                      : isInCart
                        ? "Add Another"
                        : "Add to Cart"}
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  id={`wishlist-detail-btn-${id}`}
                  onClick={handleWishlistClick}
                  disabled={isSaving}
                  aria-busy={isSaving}
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "1.05rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isSaving
                      ? "not-allowed"
                      : "pointer",
                    transition: "all 0.2s ease",
                    border: isWishlisted
                      ? "1px solid #fecdd3"
                      : "1px solid #cbd5e1",
                    background: isSaving
                      ? "#f8fafc"
                      : isWishlisted
                        ? "#fff1f2"
                        : "#ffffff",
                    color: isSaving
                      ? "#64748b"
                      : isWishlisted
                        ? "#e11d48"
                        : "#0f172a",
                    boxShadow: isWishlisted
                      ? "0 2px 8px rgba(225, 29, 72, 0.12)"
                      : "none",
                    opacity: isSaving ? 0.75 : 1,
                  }}
                >
                  {isSaving
                    ? "⏳ Saving..."
                    : isWishlisted
                      ? "♥ Added to Wishlist"
                      : "♡ Add to Wishlist"}
                </button>

                {wishlistError && (
                  <div
                    className="wishlist-error"
                    role="alert"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>⚠️</span>
                    <span>{wishlistError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;