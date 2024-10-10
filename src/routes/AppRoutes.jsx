import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Products from "../pages/products/Products";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";
import Gifts from "../pages/gifts/Gifts";
import Orders from "../pages/orders/Orders";
import Points from "../pages/points/Points";
import Categories from "../pages/category/Categories";
import Brands from "../pages/brand/Brands";
import Customers from "../pages/customers/Customers";
const AppRoutes = () => {
  const user = localStorage.getItem("email");

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:page" element={<Products />} />
          <Route path="/products/add-product" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:page" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:page" element={<Brands />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/gifts/:page" element={<Gifts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:page" element={<Orders />} />
          <Route path="/points" element={<Points />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:page" element={<Customers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
