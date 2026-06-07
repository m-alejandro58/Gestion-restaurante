import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const STATUS_LABELS = {
  pending:    { text: "Pendiente",   style: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
  in_progress:{ text: "En proceso",  style: "bg-blue-100 text-blue-700 border border-blue-200" },
  ready:      { text: "Listo",       style: "bg-purple-100 text-purple-700 border border-purple-200" },
  delivered:  { text: "Entregado",   style: "bg-green-100 text-green-700 border border-green-200" },
  cancelled:  { text: "Cancelado",   style: "bg-red-100 text-red-700 border border-red-200" },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [selectedTable, setSelectedTable] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = useCallback(() => setToast(null), []);

  const getOrders = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await axios.get("http://localhost:5000/api/orders", { params });
      setOrders(res.data);
    } catch {
      showToast("Error al obtener los pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getOrders(); }, [filterStatus]);

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tables"),
          axios.get("http://localhost:5000/api/products"),
        ]);
        setTables(tRes.data);
        setProducts(pRes.data);
      } catch {
        console.error("Error cargando mesas/productos");
      }
    };
    load();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { product: "", quantity: 1 }]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedTable("");
    setNotes("");
    setItems([{ product: "", quantity: 1 }]);
    setError("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedTable) {
      setError("Debes seleccionar una mesa");
      return;
    }
    if (items.some((i) => !i.product || Number(i.quantity) < 1)) {
      setError("Todos los productos deben estar completos y con cantidad válida");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        table: selectedTable,
        items: items.map((i) => ({ product: i.product, quantity: Number(i.quantity) })),
        notes,
      });
      showToast("Pedido creado correctamente");
      resetForm();
      getOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el pedido");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });
      showToast("Estado actualizado");
      getOrders();
    } catch {
      showToast("Error al actualizar el estado", "error");
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: "¿Seguro que deseas eliminar este pedido?",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(`http://localhost:5000/api/orders/${id}`);
          showToast("Pedido eliminado");
          getOrders();
        } catch {
          showToast("Error al eliminar el pedido", "error");
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const counts = {
    pending:     orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    ready:       orders.filter((o) => o.status === "ready").length,
    delivered:   orders.filter((o) => o.status === "delivered").length,
  };

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
        Gestión de Pedidos
      </h1>
      <p className="text-center text-orange-800 mb-10 text-lg">
        Crea y administra los pedidos de las mesas
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-5">
          <p className="text-yellow-600 font-semibold mb-1 text-sm">Pendientes</p>
          <p className="text-4xl font-bold text-yellow-700">{counts.pending}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-5">
          <p className="text-blue-600 font-semibold mb-1 text-sm">En proceso</p>
          <p className="text-4xl font-bold text-blue-700">{counts.in_progress}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-5">
          <p className="text-purple-600 font-semibold mb-1 text-sm">Listos</p>
          <p className="text-4xl font-bold text-purple-700">{counts.ready}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5">
          <p className="text-green-600 font-semibold mb-1 text-sm">Entregados</p>
          <p className="text-4xl font-bold text-green-700">{counts.delivered}</p>
        </div>
      </div>

      {/* Botón nuevo pedido */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg"
        >
          {showForm ? "✕ Cancelar" : "➕ Nuevo Pedido"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8 mb-10">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Crear nuevo pedido</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-orange-900 font-semibold mb-2">Mesa *</label>
                <select
                  value={selectedTable}
                  onChange={(e) => { setError(""); setSelectedTable(e.target.value); }}
                  className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Seleccionar mesa...</option>
                  {tables.map((t) => (
                    <option key={t._id} value={t._id}>
                      Mesa #{t.number} — {t.capacity} personas ({t.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-orange-900 font-semibold mb-2">Notas (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Sin cebolla, alergia al gluten..."
                  className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-orange-900 font-semibold">Productos *</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-orange-600 border border-orange-300 px-3 py-1 rounded-xl hover:bg-orange-50"
                >
                  + Agregar producto
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      value={item.product}
                      onChange={(e) => handleItemChange(index, "product", e.target.value)}
                      className="flex-1 border border-orange-200 bg-orange-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    >
                      <option value="">Seleccionar producto...</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} — ${p.price.toLocaleString()} (stock: {p.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className="w-20 border border-orange-200 bg-orange-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="text-red-400 hover:text-red-600 disabled:opacity-30 text-xl font-bold w-8"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg"
              >
                Crear Pedido
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold px-8 py-4 rounded-2xl transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { value: "",            label: "Todos" },
          { value: "pending",     label: "Pendientes" },
          { value: "in_progress", label: "En proceso" },
          { value: "ready",       label: "Listos" },
          { value: "delivered",   label: "Entregados" },
          { value: "cancelled",   label: "Cancelados" },
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

      {/* Lista de pedidos */}
      {loading ? (
        <div className="text-center py-20 text-orange-400 text-xl">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-orange-300 text-xl">No hay pedidos registrados</div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status];
            return (
              <div key={order._id} className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-2xl font-bold text-amber-900">
                        Mesa #{order.table?.number ?? "—"}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.style}`}>
                        {status.text}
                      </span>
                      {order.table?.location && (
                        <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                          {order.table.location}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-1 mb-3">
                      {order.items.map((item, i) => (
                        <li key={i} className="text-sm text-orange-800 flex justify-between max-w-xs">
                          <span>{item.product?.name ?? "Producto eliminado"} × {item.quantity}</span>
                          <span className="text-orange-500 font-semibold">
                            ${(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {order.notes && (
                      <p className="text-xs text-orange-500 italic">📝 {order.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-between gap-4 min-w-[180px]">
                    <p className="text-3xl font-bold text-amber-900">
                      ${order.total?.toLocaleString()}
                    </p>

                    <div className="flex flex-col gap-2 w-full">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full border border-orange-200 bg-orange-50 p-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En proceso</option>
                        <option value="ready">Listo</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>

                      <button
                        onClick={() => handleDelete(order._id)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 rounded-xl text-sm transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}

export default Orders;