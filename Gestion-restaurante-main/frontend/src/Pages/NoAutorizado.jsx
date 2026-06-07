import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NoAutorizado() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff7f2] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-[#2b1810] mb-2">Acceso denegado</h1>
        <p className="text-orange-700 mb-6">
          Tu rol <span className="font-semibold capitalize">({user?.role})</span> no tiene permisos para esta sección.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#2b1810] text-white rounded-xl font-semibold hover:bg-orange-900 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default NoAutorizado;