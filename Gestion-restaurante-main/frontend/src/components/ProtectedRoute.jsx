import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles: array de roles permitidos. Si está vacío, cualquier usuario autenticado puede acceder.
function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-orange-700 text-lg font-semibold animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}

export default ProtectedRoute;
