import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../../axiosCalls/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  // Fetch populated cart from backend
  const fetchCart = async () => {
    const response = await axiosInstance.get("/cart");

    const populatedCart = response.data.cart || [];

    setCartItems(populatedCart);

    return populatedCart;
  };

  // Public function for refreshing the cart
  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setCartLoading(true);
    setCartError("");

    try {
      await fetchCart();
    } catch (error) {
      console.error("Failed to fetch cart:", error);

      setCartError(
        error.response?.data?.message ||
          "Failed to fetch cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Load cart when authentication is ready
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [user, authLoading]);

  // Add product
  const addToCart = async (productId) => {
    setCartError("");

    try {
      // Update backend
      const response = await axiosInstance.post(
        `/cart/${productId}`
      );

      // Get populated cart and update frontend state
      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to add product to cart";

      setCartError(message);

      throw error;
    }
  };

  // Remove product
  const removeFromCart = async (productId) => {
    setCartError("");

    try {
      const response = await axiosInstance.delete(
        `/cart/${productId}`
      );

      // Get populated cart
      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to remove product from cart";

      setCartError(message);

      throw error;
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    setCartError("");

    try {
      const response = await axiosInstance.patch(
        `/cart/${productId}`,
        {
          quantity,
        }
      );

      // Get populated cart
      await fetchCart();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update cart quantity";

      setCartError(message);

      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}

export default CartContext;