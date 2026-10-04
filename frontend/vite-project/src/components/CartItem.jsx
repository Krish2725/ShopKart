import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const product = item.product;

  const handleUpdateQuantity = async (newQuantity) => {
    setUpdating(true);

    try {
      await updateQuantity(product._id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);

    try {
      await removeFromCart(product._id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="cart-item">
      <img
        src={product.image}
        alt={product.name}
        className="cart-item-image"
        style={{
          width: "150px",
          height: "150px",
          objectFit: "contain",
        }}
      />

      <div className="cart-item-details">
        <h3>{product.name}</h3>

        <p>₹{product.price}</p>

        <div className="quantity-controls">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={updating || item.quantity === 1}
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={updating || item.quantity >= product.stock}
          >
            +
          </button>
        </div>

        <button onClick={handleRemove} disabled={removing}>
          {removing ? "Removing..." : "Remove"}
        </button>
      </div>

      <div className="cart-item-total">₹{product.price * item.quantity}</div>
    </div>
  );
};

export default CartItem;
