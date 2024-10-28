import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import MetaPixel from "../pages/pixel/MetaPixel";
import Banners from "../pages/banners/Banners";
import AddBanner from "../pages/banners/AddBanner";
import UnProtected from "../layout/UnProtected";
import ProtectedLayout from "../layout/Protected";
import { AuthProvider } from "../context/AuthContext";
import RootLayout from "../layout/RootLayout";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="auth" element={<Outlet />}>
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

        <Route
          element={
            <AuthProvider>
              <RootLayout />
            </AuthProvider>
          }
        >
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Home />
              </ProtectedLayout>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            }
          />

          <Route
            path="products"
            element={
              <ProtectedLayout>
                <Products />
              </ProtectedLayout>
            }
          />
          <Route
            path="products/add-product"
            element={
              <ProtectedLayout>
                <AddProduct />
              </ProtectedLayout>
            }
          />
          <Route
            path="products/edit/:id"
            element={
              <ProtectedLayout>
                <EditProduct />
              </ProtectedLayout>
            }
          />

          <Route
            path="gifts"
            element={
              <ProtectedLayout>
                <Gifts />
              </ProtectedLayout>
            }
          />

          <Route
            path="orders"
            element={
              <ProtectedLayout>
                <Orders />
              </ProtectedLayout>
            }
          />

          <Route
            path="points"
            element={
              <ProtectedLayout>
                <Points />
              </ProtectedLayout>
            }
          />

          <Route
            path="categories"
            element={
              <ProtectedLayout>
                <Categories />
              </ProtectedLayout>
            }
          />

          <Route
            path="brands"
            element={
              <ProtectedLayout>
                <Brands />
              </ProtectedLayout>
            }
          />

          <Route
            path="send-messages"
            element={
              <ProtectedLayout>
                <SendMessages />
              </ProtectedLayout>
            }
          />

          <Route
            path="customers"
            element={
              <ProtectedLayout>
                <Customers />
              </ProtectedLayout>
            }
          />

          <Route
            path="previous-customers"
            element={
              <ProtectedLayout>
                <PreviousCustomers />
              </ProtectedLayout>
            }
          />

          <Route
            path="gallery"
            element={
              <ProtectedLayout>
                <Gallery />
              </ProtectedLayout>
            }
          />
          <Route
            path="gallerys/:slug"
            element={
              <ProtectedLayout>
                <IndividualGallery />
              </ProtectedLayout>
            }
          />

          <Route
            path="pixel-id"
            element={
              <ProtectedLayout>
                <MetaPixel />
              </ProtectedLayout>
            }
          />

          <Route
            path="banners"
            element={
              <ProtectedLayout>
                <Banners />
              </ProtectedLayout>
            }
          />
          <Route
            path="banners/add"
            element={
              <ProtectedLayout>
                <AddBanner />
              </ProtectedLayout>
            }
          />
          <Route
            path="banners/edit/:id"
            element={
              <ProtectedLayout>
                <AddBanner />
              </ProtectedLayout>
            }
          />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
