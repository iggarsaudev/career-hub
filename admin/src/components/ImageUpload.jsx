import { useState } from "react";
import { API_URL } from "../config";

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Comunicamos al padre (Dashboard) la nueva URL
        onChange(data.url);
      } else {
        alert("Error al subir la imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-700 mb-1">
        Imagen del Proyecto
      </label>

      <div className="flex items-center gap-4">
        {/* Previsualización */}
        <div className="w-24 h-24 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs text-center px-1">
              Sin imagen
            </span>
          )}
        </div>

        {/* Input de archivo (oculto visualmente pero funcional) */}
        <div className="flex-1">
          <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm inline-block">
            {uploading ? "Subiendo..." : "📷 Seleccionar Imagen"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={uploadFile}
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Formatos: JPG, PNG, WEBP.
          </p>

          {/* Opción para borrar imagen si existe */}
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")} // Borra la URL
              className="text-xs text-red-500 mt-2 hover:underline block"
            >
              Quitar imagen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
