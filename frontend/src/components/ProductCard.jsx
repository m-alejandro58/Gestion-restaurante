function ProductCard({
  product,
  handleEdit,
  handleDelete
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition duration-300">
      <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">
        {product.name}
      </h3>

      <div className="space-y-2 text-orange-900">
        <p>
          <span className="font-semibold">
            Precio:
          </span>{" "}
          ${product.price}
        </p>

        <p>
          <span className="font-semibold">
            Categoría:
          </span>{" "}
          {product.category}
        </p>

        <p>
          <span className="font-semibold">
            Stock:
          </span>{" "}
          {product.stock}
        </p>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handleEdit(product)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg transition duration-300"
        >
          Editar
        </button>

        <button
          onClick={() =>
            handleDelete(product._id)
          }
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-300"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;