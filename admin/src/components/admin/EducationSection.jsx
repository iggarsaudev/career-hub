import { useState } from "react";
import { API_URL } from "../../config";

// Hooks
import { useForm } from "../../hooks/useForm";

// Componentes UI
import Modal from "./Modal";
import AdminItemCard from "./AdminItemCard";
import { FormInput, FormTextarea } from "./FormElements";
import PdfVisibilityToggle from "./PdfToggle";

export default function EducationSection({
  educations,
  setEducations,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es");
  const [itemToDelete, setItemToDelete] = useState(null);

  const initialFormState = {
    degree: "",
    degree_en: "",
    school: "",
    startDate: "",
    endDate: "",
    description: "",
    description_en: "",
    isVisible: true,
    isVisibleInPdf: true,
    showDescriptionInPdf: true,
  };

  const { form, handleChange, setField, resetForm, setForm } =
    useForm(initialFormState);

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

  const startEditing = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        degree: item.degree || "",
        degree_en: item.degree_en || "",
        school: item.school || "",
        startDate: formatDateForInput(item.startDate),
        endDate: formatDateForInput(item.endDate),
        description: item.description || "",
        description_en: item.description_en || "",
        isVisible: item.isVisible,
        isVisibleInPdf: item.isVisibleInPdf ?? true,
        showDescriptionInPdf: item.showDescriptionInPdf ?? true,
      });
    } else {
      setEditingId(null);
      resetForm(initialFormState);
    }
    setIsFormOpen(true);
    setActiveTab("es");
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setEditingId(null);
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
        const saved = await res.json();
        setEducations((prev) => {
          const updatedList = editingId
            ? prev.map((e) => (e.id === editingId ? saved : e))
            : [...prev, saved];
          return updatedList.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate),
          );
        });
        handleCloseModal();
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

  const themeColor = editingId ? "purple" : "purple";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Formación Académica</h2>
        <button
          onClick={() => startEditing()}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition shadow-sm"
        >
          + Añadir Título
        </button>
      </div>

      {educations.length === 0 ? (
        <p className="text-gray-400 text-center py-10 italic">
          No has añadido formación académica.
        </p>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div key={edu.id} className="h-full">
              <AdminItemCard
                title={edu.degree}
                subtitle={`${edu.school} • ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
                topBadges={
                  <>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        edu.isVisibleInPdf
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      PDF:{" "}
                      {edu.isVisibleInPdf
                        ? edu.showDescriptionInPdf
                          ? "COMPLETO"
                          : "RESUMIDO"
                        : "OCULTO"}
                    </span>
                    {edu.degree_en && (
                      <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        EN
                      </span>
                    )}
                  </>
                }
                onEdit={() => startEditing(edu)}
                onDelete={() => setItemToDelete(edu)}
              >
                {edu.description}
              </AdminItemCard>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        className={
          editingId
            ? "bg-purple-50 border-purple-100"
            : "bg-gray-50 border-gray-200"
        }
      >
        <div className="flex justify-between items-start mb-6">
          <h3
            className={`font-bold text-xl ${editingId ? "text-purple-900" : "text-gray-800"}`}
          >
            {editingId ? "🎓 Editar Título" : "🎓 Nuevo Título"}
          </h3>
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
            <>
              <FormInput
                label="Título / Grado (ES)"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                color={themeColor}
              />
              <FormTextarea
                label="Descripción (ES)"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                color={themeColor}
              />
            </>
          ) : (
            <>
              <FormInput
                label="Degree / Certificate (EN)"
                name="degree_en"
                value={form.degree_en}
                onChange={handleChange}
                color={themeColor}
              />
              <FormTextarea
                label="Description (EN)"
                name="description_en"
                value={form.description_en}
                onChange={handleChange}
                rows={2}
                color={themeColor}
              />
            </>
          )}

          <hr className={`border-${themeColor}-200/50 my-4`} />

          <FormInput
            label="Centro / Escuela"
            name="school"
            value={form.school}
            onChange={handleChange}
            color={themeColor}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              type="date"
              label="Fecha Inicio"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              color={themeColor}
              required
            />
            <FormInput
              type="date"
              label="Fecha Fin"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              color={themeColor}
            />
          </div>

          <div className="space-y-2">
            <PdfVisibilityToggle
              checked={form.isVisibleInPdf}
              onChange={(checked) => setField("isVisibleInPdf", checked)}
              color={themeColor}
              label="Incluir este título en el CV (PDF)"
            />
            {form.isVisibleInPdf && (
              <div className="ml-5 p-2 bg-white/40 rounded border border-transparent hover:border-purple-200 transition-colors inline-block">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
                  <input
                    type="checkbox"
                    name="showDescriptionInPdf"
                    checked={form.showDescriptionInPdf}
                    onChange={handleChange}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  Mostrar descripción detallada en el PDF
                </label>
              </div>
            )}
          </div>

          <div
            className={`flex gap-3 pt-4 border-t border-${themeColor}-200 mt-6`}
          >
            <button
              type="submit"
              className={`px-6 py-2.5 text-white rounded-lg shadow-sm font-bold transition ${editingId ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"}`}
            >
              {editingId ? "Actualizar" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal borrado */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        className="max-w-sm bg-white"
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            ¿Eliminar Título?
          </h3>
          <p className="text-gray-500 text-center text-sm mb-6">
            Se eliminará <strong>"{itemToDelete?.degree}"</strong>.
          </p>
          <div className="flex gap-3 w-full">
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
      </Modal>
    </div>
  );
}
