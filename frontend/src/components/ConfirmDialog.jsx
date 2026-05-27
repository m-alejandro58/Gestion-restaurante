function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-8 max-w-sm w-full mx-4">

        <div className="text-center mb-6">

          <div className="text-5xl mb-4">🗑️</div>

          <h3 className="text-xl font-bold text-amber-900 mb-2">
            Confirmar eliminación
          </h3>

          <p className="text-orange-800">
            {message}
          </p>

        </div>

        <div className="flex gap-4">

          <button
            onClick={onCancel}
            className="flex-1 border border-orange-200 hover:bg-orange-50 text-orange-900 font-semibold py-3 rounded-2xl transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-2xl transition"
          >
            Eliminar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmDialog;
