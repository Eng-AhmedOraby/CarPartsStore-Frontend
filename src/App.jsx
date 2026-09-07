import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProductForm from "./pages/ProductForm";
import StoreSettingsForm from "./pages/StoreSettingsForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><StoreSettingsForm /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;