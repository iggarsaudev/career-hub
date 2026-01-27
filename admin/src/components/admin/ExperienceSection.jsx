import { useState } from "react";
import { API_URL } from "../../config";

export default function ExperienceSection({
  experiences,
  setExperiences,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es"); // Control de Pestañas

  const [form, setForm] = useState({
    position: "",
    position_en: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    description_en: "",
    isVisible: true,
    // NUEVOS CAMPOS PDF
    isVisibleInPdf: true,
    showDescriptionInPdf: true,
  });

  // Estado para el Modal de Borrado
  const [itemToDelete, setItemToDelete] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "Actualidad";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (exp) => {
    setEditingId(exp.id);
    setForm({
      position: exp.position || "",
      position_en: exp.position_en || "",
      company: exp.company || "",
      startDate: formatDateForInput(exp.startDate),
      endDate: formatDateForInput(exp.endDate),
      description: exp.description || "",
      description_en: exp.description_en || "",
      isVisible: exp.isVisible,
      // Cargamos valores PDF (si no existen, default true)
      isVisibleInPdf: exp.isVisibleInPdf ?? true,
      showDescriptionInPdf: exp.showDescriptionInPdf ?? true,
    });
    setIsFormOpen(true);
    setActiveTab("es");
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm({
      position: "",
      position_en: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      description_en: "",
      isVisible: true,
      isVisibleInPdf: true,
      showDescriptionInPdf: true,
    });
    setActiveTab("es");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, endDate: form.endDate || null };
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/experience/${editingId}`
        : `${API_URL}/experience`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedExp = await res.json();
        setExperiences((prev) => {
          const updatedList = editingId
            ? prev.map((e) => (e.id === editingId ? savedExp : e))
            : [...prev, savedExp];
          return updatedList.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate),
          );
        });
        resetForm();
        showNotification(
          editingId ? "Experiencia actualizada" : "Experiencia añadida",
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
      const res = await fetch(`${API_URL}/experience/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExperiences((prev) => prev.filter((e) => e.id !== itemToDelete.id));
        showNotification("Experiencia eliminada", "success");
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
        <h2 className="text-xl font-bold text-gray-800">Experiencia Laboral</h2>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            + Añadir Experiencia
          </button>
        )}
      </div>

      {isFormOpen && (
        <div
          className={`mb-8 p-6 rounded-xl border animate-fade-in ${
            editingId
              ? "bg-emerald-50 border-emerald-100"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <h3
              className={`font-bold ${
                editingId ? "text-emerald-900" : "text-green-900"
              }`}
            >
              {editingId ? "💼 Editar Experiencia" : "💼 Nueva Experiencia"}
            </h3>

            {/* Tabs de idiomas */}
            <div className="flex bg-white/50 rounded-lg p-1 text-sm font-medium border border-green-200">
              <button
                type="button"
                onClick={() => setActiveTab("es")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "es" ? "bg-white text-green-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
              >
                Español
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-3 py-1 rounded-md transition-all ${activeTab === "en" ? "bg-white text-green-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
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
                      Cargo / Puesto (ES)
                    </label>
                    <input
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Ej: Senior Frontend Dev"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    rows="3"
                    placeholder="Responsabilidades y logros..."
                  />
                </div>
              </>
            ) : (
              // Inglés
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Job Title (EN)
                    </label>
                    <input
                      name="position_en"
                      value={form.position_en}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="e.g. Senior Frontend Dev"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    rows="3"
                    placeholder="Key responsibilities and achievements..."
                  />
                </div>
              </>
            )}

            {/* Separados */}
            <hr className="border-green-200/50 my-4" />

            {/* Campos comunes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Empresa (Común)
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Nombre de la empresa"
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
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fecha Fin (Dejar vacío si es actual)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* --- OPCIONES DE VISIBILIDAD (PDF) --- */}
            <div className="bg-white/60 p-4 rounded-lg border border-green-200 mt-4 space-y-3">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                📄 Configuración de Exportación (PDF)
              </p>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isVisibleInPdf"
                    checked={form.isVisibleInPdf ?? true} // Default true
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isVisibleInPdf: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                  Incluir este puesto en el CV (PDF)
                </span>
              </label>

              {/* Solo mostramos la opción de descripción si el puesto es visible en PDF */}
              {(form.isVisibleInPdf ?? true) && (
                <label className="flex items-center gap-3 cursor-pointer group animate-fade-in pl-1">
                  <input
                    type="checkbox"
                    name="showDescriptionInPdf"
                    checked={form.showDescriptionInPdf ?? true}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        showDescriptionInPdf: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">
                    Mostrar descripción detallada en el PDF
                  </span>
                </label>
              )}
            </div>
            {/* ------------------------------------- */}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded shadow-sm font-medium transition ${
                  editingId
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-green-600 hover:bg-green-700"
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

      {/* Listado de experiencias laborales */}
      {experiences.length === 0 && !isFormOpen ? (
        <p className="text-gray-400 text-center py-10 italic">
          Aún no has añadido experiencia laboral.
        </p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start gap-4 relative"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-gray-800 text-lg">
                    {exp.position}
                  </h4>
                  {/* Badge EN */}
                  {exp.position_en && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                      EN
                    </span>
                  )}

                  {/* --- BADGES NUEVOS --- */}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${exp.isVisibleInPdf ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}
                  >
                    PDF:{" "}
                    {exp.isVisibleInPdf
                      ? exp.showDescriptionInPdf
                        ? "COMPLETO"
                        : "RESUMIDO"
                      : "OCULTO"}
                  </span>
                  {/* --------------------- */}
                </div>

                {/* Subtítulo inglés */}
                {exp.position_en && (
                  <p className="text-xs text-gray-400 mb-1">
                    {exp.position_en}
                  </p>
                )}

                <p className="text-green-700 font-medium mb-1">{exp.company}</p>
                <p className="text-xs text-gray-500 mb-3">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(exp)}
                  className="text-gray-400 hover:text-emerald-600 transition p-2 hover:bg-emerald-50 rounded"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setItemToDelete(exp)}
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
                ¿Eliminar Experiencia?
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6">
                Se eliminará <strong>"{itemToDelete.position}"</strong> en{" "}
                {itemToDelete.company}.
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
