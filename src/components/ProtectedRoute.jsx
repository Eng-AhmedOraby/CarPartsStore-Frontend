import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <p>جاري التحقق...</p>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return children;
}

export default ProtectedRoute;