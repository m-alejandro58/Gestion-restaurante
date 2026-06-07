import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./Pages/Login";
import NoAutorizado from "./Pages/NoAutorizado";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Inventory from "./Pages/Inventory";
import Tables from "./Pages/Tables";
import Orders from "./Pages/Orders";
import Usuarios from "./Pages/Usuarios";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-orange-50">
          <Routes>
            {/* Pública */}
            <Route path="/login" element={<Login />} />
            <Route path="/no-autorizado" element={<NoAutorizado />} />

            {/* Solo Admin */}
            <Route path="/" element={
              <ProtectedRoute roles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute roles={["admin"]}>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute roles={["admin"]}>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/usuarios" element={
              <ProtectedRoute roles={["admin"]}>
                <Usuarios />
              </ProtectedRoute>
            } />

            {/* Admin y Mesero */}
            <Route path="/tables" element={
              <ProtectedRoute roles={["admin", "mesero"]}>
                <Tables />
              </ProtectedRoute>
            } />

            {/* Todos los roles autenticados */}
            <Route path="/orders" element={
              <ProtectedRoute roles={["admin", "mesero", "cocinero"]}>
                <Orders />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
