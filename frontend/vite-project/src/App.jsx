import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Logout from "./pages/Logout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PublicRoutes from "./components/PublicRoutes.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Orders from "./pages/Orders.jsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/register"
              element={
                <PublicRoutes>
                  <Register />
                </PublicRoutes>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoutes>
                  <Login />
                </PublicRoutes>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoutes>
                  <Cart />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoutes>
                  <Checkout />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoutes>
                  <Orders />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoutes>
                  <OrderDetails />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoutes>
                  <Products />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoutes>
                  <ProductDetails />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoutes>
                  <Wishlist />
                </ProtectedRoutes>
              }
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
