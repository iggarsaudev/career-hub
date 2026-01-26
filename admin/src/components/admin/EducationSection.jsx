import { useState } from "react";
import { API_URL } from "../../config";

export default function EducationSection({
  educations,
  setEducations,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es"); // Control de Pestañas

  // Estado para el formulario
  const [form, setForm] = useState({
    degree: "",
    degree_en: "",
    school: "",
    startDate: "",
    endDate: "",
    description: "",
    description_en: "",
    isVisible: true,
  });

  // Estado para el Modal de Borrado
  const [itemToDelete, setItemToDelete] = useState(null);

  // Formatear fecha para visualización (Ej: "Sep 2020")
  const formatDate = (dateString) => {
    if (!dateString) return "Actualidad";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  // Formatear fecha para el input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setForm({
      degree: item.degree || "",
      degree_en: item.degree_en || "", // Cargar inglés
      school: item.school || "",
      startDate: formatDateForInput(item.startDate),
      endDate: formatDateForInput(item.endDate),
      description: item.description || "",
      description_en: item.description_en || "", // Cargar inglés
      isVisible: item.isVisible,
    });
    setIsFormOpen(true);
    setActiveTab("es");
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm({
      degree: "",
      degree_en: "",
      school: "",
      startDate: "",
      endDate: "",
      description: "",
      description_en: "",
      isVisible: true,
    });
    setActiveTab("es");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, endDate: form.endDate || null };
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/education/${editingId}`
        : `${API_URL}/education`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedItem = await res.json();
        setEducations((prev) => {
          const updatedList = editingId
            ? prev.map((e) => (e.id === editingId ? savedItem : e))
            : [...prev, savedItem];
          // Reordenar por fecha (más reciente primero)
          return updatedList.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate),
          );
        });
        resetForm();
        showNotification(
          editingId ? "Formación actualizada" : "Formación añadida",
          "success",
        );
      } else {
        showNotification("Error al guardar", "error");
      }
    } catch (error) {
      showNotification("Error de conexión", "error");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`${API_URL}/education/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEducations((prev) => prev.filter((e) => e.id !== itemToDelete.id));
        showNotification("Formación eliminada", "success");
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch (error) {
      showNotification("Error de conexión", "error");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Formación Académica</h2>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            + Añadir Título
          </button>
        )}
      </div>

      {isFormOpen && (
        <div
          className={`mb-8 p-6 rounded-xl border animate-fade-in ${
            editingId
              ? "bg-purple-50 border-purple-100"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <h3
              className={`font-bold ${
                editingId ? "text-purple-900" : "text-gray-800"
              }`}
            >
              {editingId ? "🎓 Editar Título" : "🎓 Nuevo Título"}
            </h3>

            {/* Tabs de idioma */}
            <div className="flex bg-white/50 rounded-lg p-1 text-sm font-medium border border-purple-200">
              <button
                type="button"
                onClick={() => setActiveTab("es")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "es" ? "bg-white text-purple-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
              >
                Español
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "en" ? "bg-white text-purple-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
              >
                Inglés
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {activeTab === "es" ? (
              // Español
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Título / Grado (ES)
                    </label>
                    <input
                      name="degree"
                      value={form.degree}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Ej: Grado Superior DAM"
                    />
                  </div>
                  <div className="hidden md:block"></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Descripción (ES)
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    rows="2"
                    placeholder="Logros, menciones o detalles..."
                  />
                </div>
              </>
            ) : (
              // Inglés
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Degree / Certificate (EN)
                    </label>
                    <input
                      name="degree_en"
                      value={form.degree_en}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g. Bachelor's in CS"
                    />
                  </div>
                  <div className="hidden md:block"></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Description (EN)
                  </label>
                  <textarea
                    name="description_en"
                    value={form.description_en}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                    rows="2"
                    placeholder="Honors, achievements..."
                  />
                </div>
              </>
            )}

            {/* Separador */}
            <hr className="border-purple-200/50 my-4" />

            {/* Campos comunes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Centro / Escuela (Común)
                </label>
                <input
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Ej: IES Politécnico"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fecha Fin (Dejar vacío si cursando)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded shadow-sm font-medium transition ${
                  editingId
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de educación */}
      {educations.length === 0 && !isFormOpen ? (
        <p className="text-gray-400 text-center py-10 italic">
          No has añadido formación académica.
        </p>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start gap-4 relative"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-800 text-lg">
                    {edu.degree}
                  </h4>
                  {/* Badge EN */}
                  {edu.degree_en && (
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">
                      EN
                    </span>
                  )}
                </div>

                {/* Subtítulo inglés */}
                {edu.degree_en && (
                  <p className="text-xs text-gray-400 mb-1">
                    🇺🇸 {edu.degree_en}
                  </p>
                )}

                <p className="text-purple-700 font-medium mb-1">{edu.school}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
                {edu.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {edu.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(edu)}
                  className="text-gray-400 hover:text-purple-600 transition p-2 hover:bg-purple-50 rounded"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setItemToDelete(edu)}
                  className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar Título?
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6">
                Se eliminará <strong>"{itemToDelete.degree}"</strong>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
