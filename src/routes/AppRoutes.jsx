import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import SendMessages from "../pages/send-messages/SendMessages";
import Customers from "../pages/customers/Customers";
import PreviousCustomers from "../pages/previous-customers/PreviousCustomers";
import Gallery from "../pages/gallery/Gallery";
import IndividualGallery from "../pages/gallery/IndividualGallery";
import RootLayout from "../layout/RootLayout";
import Protected from "../layout/Protected";
import UnProtected from "../layout/UnProtected";
import { AuthProvider } from "../context/AuthContext";
import MetaPixel from "../pages/pixel/MetaPixel";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        }
      >
        <Route
          index
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="products"
          element={
            <Protected>
              <Products />
            </Protected>
          }
        />
        <Route
          path="products/:page"
          element={
            <Protected>
              <Products />
            </Protected>
          }
        />
        <Route
          path="products/add-product"
          element={
            <Protected>
              <AddProduct />
            </Protected>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <Protected>
              <EditProduct />
            </Protected>
          }
        />
        <Route
          path="categories"
          element={
            <Protected>
              <Categories />
            </Protected>
          }
        />
        <Route
          path="categories/:page"
          element={
            <Protected>
              <Categories />
            </Protected>
          }
        />
        <Route
          path="brands"
          element={
            <Protected>
              <Brands />
            </Protected>
          }
        />
        <Route
          path="brands/:page"
          element={
            <Protected>
              <Brands />
            </Protected>
          }
        />
        <Route
          path="gifts"
          element={
            <Protected>
              <Gifts />
            </Protected>
          }
        />
        <Route
          path="gifts/:page"
          element={
            <Protected>
              <Gifts />
            </Protected>
          }
        />
        <Route
          path="orders"
          element={
            <Protected>
              <Orders />
            </Protected>
          }
        />
        <Route
          path="orders/:page"
          element={
            <Protected>
              <Orders />
            </Protected>
          }
        />
        <Route
          path="points"
          element={
            <Protected>
              <Points />
            </Protected>
          }
        />
        <Route
          path="customers"
          element={
            <Protected>
              <Customers />
            </Protected>
          }
        />
        <Route
          path="customers/:page"
          element={
            <Protected>
              <Customers />
            </Protected>
          }
        />
        <Route
          path="previous-customers"
          element={
            <Protected>
              <PreviousCustomers />
            </Protected>
          }
        />
        <Route
          path="send-messages"
          element={
            <Protected>
              <SendMessages />
            </Protected>
          }
        />
        <Route
          path="gallery"
          element={
            <Protected>
              <Gallery />
            </Protected>
          }
        />
        <Route
          path="gallery/:page"
          element={
            <Protected>
              <Gallery />
            </Protected>
          }
        />
        <Route
          path="gallerys/:slug"
          element={
            <Protected>
              <IndividualGallery />
            </Protected>
          }
        />
        <Route
          path="pixel-id"
          element={
            <Protected>
              <MetaPixel />
            </Protected>
          }
        />
        <Route
          path="profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
      </Route>
      <Route
        path="auth"
        element={
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        }
      >
        <Route
          path="login"
          element={
            <UnProtected>
              <Login />
            </UnProtected>
          }
        />
        <Route
          path="signup"
          element={
            <UnProtected>
              <SignUp />
            </UnProtected>
          }
        />
        <Route
          path="forgot-password"
          element={
            <UnProtected>
              <ForgotPassword />
            </UnProtected>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="auth/login" />} />
    </Routes>
  );
};

export default AppRoutes;
