import { useState } from "react";
import { API_URL } from "../../config";

// Hooks
import { useForm } from "../../hooks/useForm";

// Componentes UI
import Modal from "./Modal";
import AdminItemCard from "./AdminItemCard";
import { FormInput, FormTextarea } from "./FormElements";
import PdfVisibilityToggle from "./PdfToggle";

export default function ExperienceSection({
  experiences,
  setExperiences,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es");
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estado inicial
  const initialFormState = {
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
  };

  const { form, handleChange, setField, resetForm, setForm } =
    useForm(initialFormState);

  // Helpers de fecha
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

  // Abrir Modal
  const startEditing = (exp = null) => {
    if (exp) {
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
        isVisibleInPdf: exp.isVisibleInPdf ?? true,
        showDescriptionInPdf: exp.showDescriptionInPdf ?? true,
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

  // Guardar
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
        const saved = await res.json();
        setExperiences((prev) => {
          const updatedList = editingId
            ? prev.map((e) => (e.id === editingId ? saved : e))
            : [...prev, saved];
          return updatedList.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate),
          );
        });
        handleCloseModal();
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

  // Borrar
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

  const themeColor = editingId ? "emerald" : "green";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Experiencia Laboral</h2>
        <button
          onClick={() => startEditing()}
          className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          + Añadir Experiencia
        </button>
      </div>

      {/* Listado */}
      {experiences.length === 0 ? (
        <p className="text-gray-400 text-center py-10 italic">
          Aún no has añadido experiencia laboral.
        </p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="h-full">
              {" "}
              {/* Wrapper para altura */}
              <AdminItemCard
                title={exp.position}
                subtitle={`${exp.company} • ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                // Badges Superiores
                topBadges={
                  <>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        exp.isVisibleInPdf
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      PDF:{" "}
                      {exp.isVisibleInPdf
                        ? exp.showDescriptionInPdf
                          ? "COMPLETO"
                          : "RESUMIDO"
                        : "OCULTO"}
                    </span>
                    {exp.position_en && (
                      <span className="bg-green-100 text-green-700 border border-green-200 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        EN
                      </span>
                    )}
                  </>
                }
                onEdit={() => startEditing(exp)}
                onDelete={() => setItemToDelete(exp)}
              >
                {/* Descripción (Truncada por la card automáticamente) */}
                {exp.description}
              </AdminItemCard>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        className={
          editingId
            ? "bg-emerald-50 border-emerald-100"
            : "bg-green-50 border-green-200"
        }
      >
        <div className="flex justify-between items-start mb-6">
          <h3
            className={`font-bold text-xl ${editingId ? "text-emerald-900" : "text-green-900"}`}
          >
            {editingId ? "💼 Editar Experiencia" : "💼 Nueva Experiencia"}
          </h3>
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
            <>
              <FormInput
                label="Cargo / Puesto (ES)"
                name="position"
                value={form.position}
                onChange={handleChange}
                color={themeColor}
              />
              <FormTextarea
                label="Descripción (ES)"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                color={themeColor}
              />
            </>
          ) : (
            <>
              <FormInput
                label="Job Title (EN)"
                name="position_en"
                value={form.position_en}
                onChange={handleChange}
                color={themeColor}
              />
              <FormTextarea
                label="Description (EN)"
                name="description_en"
                value={form.description_en}
                onChange={handleChange}
                rows={3}
                color={themeColor}
              />
            </>
          )}

          <hr className={`border-${themeColor}-200/50 my-4`} />

          <FormInput
            label="Empresa"
            name="company"
            value={form.company}
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
              label="Fecha Fin (Vacío si actual)"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              color={themeColor}
            />
          </div>

          {/* Gestión PDF */}
          <div className="space-y-2">
            <PdfVisibilityToggle
              checked={form.isVisibleInPdf}
              onChange={(checked) => setField("isVisibleInPdf", checked)}
              color={themeColor}
              label="Incluir este puesto en el CV (PDF)"
            />

            {/* Check extra para descripción (manual porque el componente genérico solo tiene 1 toggle) */}
            {form.isVisibleInPdf && (
              <div className="ml-5 p-2 bg-white/40 rounded border border-transparent hover:border-green-200 transition-colors inline-block">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
                  <input
                    type="checkbox"
                    name="showDescriptionInPdf"
                    checked={form.showDescriptionInPdf}
                    onChange={handleChange}
                    className="rounded text-green-600 focus:ring-green-500"
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
              className={`px-6 py-2.5 text-white rounded-lg shadow-sm font-bold transition ${editingId ? "bg-emerald-600 hover:bg-emerald-700" : "bg-green-600 hover:bg-green-700"}`}
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
            ¿Eliminar Experiencia?
          </h3>
          <p className="text-gray-500 text-center text-sm mb-6">
            Se eliminará <strong>"{itemToDelete?.position}"</strong> en{" "}
            {itemToDelete?.company}.
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
