// App.jsx
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DefaultLayout from "./layout/DefaultLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Customers from "./components/dashboard/Customers";
import AllProducts from "./pages/AllProducts";
import { Cart } from "./pages/Cart";
import UserOrders from "./pages/Orders";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { CartProvider, useCartContext } from "./context/CartContext";
import Products from "./components/dashboard/Products";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Admin Routes
function AdminRoutes() {
  const { authState, isAuthenticated } = useAuthContext();
  return isAuthenticated() && authState?.user?.roles?.includes("Admin") ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}

// Payment Success Component
function PaymentSuccessful() {
  const { setCart } = useCartContext();

  useEffect(() => {
    setCart([]);
  }, [setCart]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2 style={{ color: "#4CAF50", fontWeight: "bold" }}>Payment Successful!</h2>
    </div>
  );
}

// Main App component
function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            <ToastContainer position="top-right" />
            <BrowserRouter>
              <Routes>
                <Route element={<DefaultLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<AllProducts />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/success" element={<PaymentSuccessful />} />
                  <Route path="/orders" element={<UserOrders />} />
                </Route>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route element={<AdminRoutes />}>
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="/dashboard/customers" element={<Customers />} />
                    <Route path="/dashboard/products" element={<Products />} />
                  </Route>
                </Route>
                <Route path="*" element={<h2>Page not found</h2>} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
