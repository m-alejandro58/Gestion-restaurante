function ProductForm({
  formData,
  handleChange,
  handleSubmit,
  editingId
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 mb-12">

      <div className="mb-10 text-center">

        <h2 className="text-4xl font-bold text-amber-900 mb-3">
          {editingId
            ? "Editar Producto"
            : "Registrar Producto"}
        </h2>

        <p className="text-orange-700 text-lg">
          Completa la información del producto
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >

        <div>

          <label className="block text-orange-900 font-semibold mb-3">
            Nombre del producto
          </label>

          <input
            type="text"
            name="name"
            placeholder="Ej: Hamburguesa BBQ"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

        </div>

        <div>

          <label className="block text-orange-900 font-semibold mb-3">
            Precio
          </label>

          <input
            type="number"
            name="price"
            placeholder="Ej: 25000"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

        </div>

        <div>

          <label className="block text-orange-900 font-semibold mb-3">
            Categoría
          </label>

          <input
            type="text"
            name="category"
            placeholder="Ej: Comida rápida"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

        </div>

        <div>

          <label className="block text-orange-900 font-semibold mb-3">
            Stock disponible
          </label>

          <input
            type="number"
            name="stock"
            placeholder="Ej: 15"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

        </div>

        <div className="md:col-span-2 flex justify-center pt-4">

          <button
            type="submit"
            className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold px-12 py-4 rounded-2xl shadow-lg transition duration-300 text-lg"
          >
            {editingId
              ? "Actualizar Producto"
              : "Guardar Producto"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default ProductForm;