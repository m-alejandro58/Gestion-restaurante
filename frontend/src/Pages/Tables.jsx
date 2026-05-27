import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const STATUS_LABELS = {
  available: { text: "Disponible", style: "bg-green-100 text-green-700 border border-green-200" },
  occupied:  { text: "Ocupada",    style: "bg-red-100 text-red-700 border border-red-200" },
  reserved:  { text: "Reservada",  style: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
};

const LOCATION_LABELS = {
  interior: "Interior",
  exterior: "Exterior",
  bar:      "Bar",
};

const INITIAL_FORM = { number: "", capacity: "", status: "available", location: "interior" };

function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [filterStatus, setFilterStatus] = useState("");

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = useCallback(() => setToast(null), []);

  const getTables = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await axios.get("http://localhost:5000/api/tables", { params });
      setTables(res.data);
    } catch {
      showToast("Error al obtener las mesas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getTables(); }, [filterStatus]);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.number || !formData.capacity) {
      setError("El número y la capacidad son obligatorios");
      return;
    }
    if (Number(formData.capacity) < 1) {
      setError("La capacidad debe ser mayor a 0");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/tables/${editingId}`, formData);
        showToast("Mesa actualizada correctamente");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/tables", formData);
        showToast("Mesa creada correctamente");
      }
      setFormData(INITIAL_FORM);
      getTables();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la mesa");
    }
  };

  const handleEdit = (table) => {
    setEditingId(table._id);
    setError("");
    setFormData({
      number:   table.number,
      capacity: table.capacity,
      status:   table.status,
      location: table.location,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: "¿Seguro que deseas eliminar esta mesa?",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(`http://localhost:5000/api/tables/${id}`);
          showToast("Mesa eliminada correctamente");
          getTables();
        } catch {
          showToast("Error al eliminar la mesa", "error");
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const available = tables.filter((t) => t.status === "available").length;
  const occupied  = tables.filter((t) => t.status === "occupied").length;
  const reserved  = tables.filter((t) => t.status === "reserved").length;

  return (
    <MainLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}

      <h1 className="text-5xl font-bold text-center text-amber-900 mb-3">
        Gestión de Mesas
      </h1>
      <p className="text-center text-orange-800 mb-10 text-lg">
        Administra las mesas y su disponibilidad
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
          <p className="text-green-600 font-semibold mb-1">Disponibles</p>
          <p className="text-4xl font-bold text-green-700">{available}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-red-100 p-6">
          <p className="text-red-600 font-semibold mb-1">Ocupadas</p>
          <p className="text-4xl font-bold text-red-700">{occupied}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6">
          <p className="text-yellow-600 font-semibold mb-1">Reservadas</p>
          <p className="text-4xl font-bold text-yellow-700">{reserved}</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8 mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">
          {editingId ? "✏️ Editar Mesa" : "➕ Nueva Mesa"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-orange-900 font-semibold mb-2">Número de mesa *</label>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Ej: 5"
              className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-orange-900 font-semibold mb-2">Capacidad (personas) *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Ej: 4"
              className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-orange-900 font-semibold mb-2">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="available">Disponible</option>
              <option value="occupied">Ocupada</option>
              <option value="reserved">Reservada</option>
            </select>
          </div>

          <div>
            <label className="block text-orange-900 font-semibold mb-2">Ubicación</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="bar">Bar</option>
            </select>
          </div>

          {error && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg"
            >
              {editingId ? "Actualizar Mesa" : "Crear Mesa"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData(INITIAL_FORM); setError(""); }}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold px-8 py-4 rounded-2xl transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { value: "",           label: "Todas" },
          { value: "available",  label: "Disponibles" },
          { value: "occupied",   label: "Ocupadas" },
          { value: "reserved",   label: "Reservadas" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${
              filterStatus === value
                ? "bg-orange-600 text-white shadow"
                : "bg-white text-orange-800 border border-orange-200 hover:bg-orange-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid de mesas */}
      {loading ? (
        <div className="text-center py-20 text-orange-400 text-xl">Cargando mesas...</div>
      ) : tables.length === 0 ? (
        <div className="text-center py-20 text-orange-300 text-xl">No hay mesas registradas</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => {
            const status = STATUS_LABELS[table.status];
            return (
              <div key={table._id} className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest">Mesa</p>
                    <h3 className="text-5xl font-bold text-amber-900">#{table.number}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.style}`}>
                    {status.text}
                  </span>
                </div>

                <div className="text-sm text-orange-700 space-y-1">
                  <p>👥 Capacidad: <strong>{table.capacity} personas</strong></p>
                  <p>📍 Ubicación: <strong>{LOCATION_LABELS[table.location]}</strong></p>
                </div>

                <div className="flex gap-2 mt-auto pt-2 border-t border-orange-50">
                  <button
                    onClick={() => handleEdit(table)}
                    className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold py-2 rounded-xl text-sm transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 rounded-xl text-sm transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}

export default Tables;