function ProductCard({
  product,
  handleEdit,
  handleDelete
}) {
  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        text: "Agotado",
        style: "bg-red-100 text-red-700"
      };
    }

    if (product.stock <= 5) {
      return {
        text: "Stock Bajo",
        style: "bg-yellow-100 text-yellow-700"
      };
    }

    return {
      text: "Disponible",
      style: "bg-green-100 text-green-700"
    };
  };

  const status = getStockStatus();

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300">

      <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5">

        <div className="flex justify-between items-start">

          <h2 className="text-2xl font-bold text-white">
            {product.name}
          </h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold bg-white ${status.style}`}
          >
            {status.text}
          </span>

        </div>

      </div>

      <div className="p-6">

        <div className="space-y-4 text-orange-900">

          <div className="flex justify-between items-center border-b border-orange-100 pb-3">

            <span className="font-semibold">
              Categoría
            </span>

            <span>
              {product.category}
            </span>

          </div>

          <div className="flex justify-between items-center border-b border-orange-100 pb-3">

            <span className="font-semibold">
              Precio
            </span>

            <span className="text-lg font-bold text-amber-900">
              ${product.price}
            </span>

          </div>

          <div className="flex justify-between items-center">

            <span className="font-semibold">
              Stock
            </span>

            <span className="text-lg font-bold">
              {product.stock}
            </span>

          </div>

        </div>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => handleEdit(product)}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Editar
          </button>

          <button
            onClick={() =>
              handleDelete(product._id)
            }
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
          >
            Eliminar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;