function ProductForm({
  formData,
  handleChange,
  handleSubmit,
  editingId
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-orange-100">

      <h2 className="text-3xl font-semibold text-amber-900 text-center mb-8">
        {editingId
          ? "Editar Producto"
          : "Agregar Producto"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={formData.name}
          onChange={handleChange}
          className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={formData.category}
          onChange={handleChange}
          className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock disponible"
          value={formData.stock}
          onChange={handleChange}
          className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <div className="md:col-span-2 flex justify-center">

          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-xl transition duration-300 shadow-md"
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