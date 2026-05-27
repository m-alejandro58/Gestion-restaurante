import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-800"
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠"
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 border px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold animate-fade-in ${styles[type]}`}
    >
      <span className="text-lg font-bold">
        {icons[type]}
      </span>

      <span>{message}</span>

      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
