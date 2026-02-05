import { useState } from "react";
import { API_URL } from "../../config";
import { useForm } from "../../hooks/useForm";
import Modal from "./Modal";
import AdminItemCard from "./AdminItemCard";
import { FormInput } from "./FormElements";

export default function LanguageSection({
  languages,
  setLanguages,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es");
  const [itemToDelete, setItemToDelete] = useState(null);

  const initialFormState = {
    name: "",
    name_en: "",
    level: "",
    level_en: "",
    isVisible: true,
  };

  const { form, handleChange, resetForm, setForm } = useForm(initialFormState);

  const startEditing = (lang = null) => {
    if (lang) {
      setEditingId(lang.id);
      setForm({
        name: lang.name || "",
        name_en: lang.name_en || "",
        level: lang.level || "",
        level_en: lang.level_en || "",
        isVisible: lang.isVisible ?? true,
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
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/languages/${editingId}`
        : `${API_URL}/languages`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        setLanguages((prev) => {
          if (editingId)
            return prev.map((l) => (l.id === editingId ? saved : l));
          return [...prev, saved];
        });
        handleCloseModal();
        showNotification(
          editingId ? "Idioma actualizado" : "Idioma añadido",
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
      const res = await fetch(`${API_URL}/languages/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLanguages((prev) => prev.filter((l) => l.id !== itemToDelete.id));
        showNotification("Idioma eliminado", "success");
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
        <h2 className="text-xl font-bold text-gray-800">Idiomas</h2>
        <button
          onClick={() => startEditing()}
          className="px-4 py-2 bg-pink-600 text-white text-sm font-bold rounded-lg hover:bg-pink-700 transition shadow-sm"
        >
          + Añadir Idioma
        </button>
      </div>

      {languages.length === 0 ? (
        <p className="text-gray-400 text-center py-10 italic">
          No has añadido idiomas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div key={lang.id} className="h-full">
              <AdminItemCard
                title={lang.name}
                // Si no hay nivel, no mostramos subtítulo vacío
                subtitle={lang.level || ""}
                tags={[
                  ...(lang.name_en
                    ? [
                        {
                          text: `🇺🇸 ${lang.name_en}`,
                          colorClass: "bg-gray-50 text-gray-500",
                        },
                      ]
                    : []),
                  ...(lang.level_en
                    ? [
                        {
                          text: lang.level_en,
                          colorClass:
                            "bg-pink-50 text-pink-700 border-pink-100",
                        },
                      ]
                    : []),
                ]}
                withImageSection={false}
                onEdit={() => startEditing(lang)}
                onDelete={() => setItemToDelete(lang)}
              />
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
            ? "bg-pink-50 border-pink-100"
            : "bg-gray-50 border-gray-200"
        }
      >
        <div className="flex justify-between items-start mb-6">
          <h3
            className={`font-bold text-xl ${editingId ? "text-pink-900" : "text-gray-800"}`}
          >
            {editingId ? "🗣️ Editar Idioma" : "🗣️ Nuevo Idioma"}
          </h3>
          <div className="flex bg-white/50 rounded-lg p-1 text-sm font-medium border border-pink-200">
            <button
              type="button"
              onClick={() => setActiveTab("es")}
              className={`px-3 py-1 rounded-md transition-all ${activeTab === "es" ? "bg-white text-pink-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Español
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-3 py-1 rounded-md transition-all ${activeTab === "en" ? "bg-white text-pink-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Inglés
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === "es" ? (
            <>
              <FormInput
                label="Idioma (ES)"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Español"
                color="pink"
                required
              />
              <FormInput
                label="Nivel (ES)"
                name="level"
                value={form.level}
                onChange={handleChange}
                placeholder="Ej: Nativo, B2 (Opcional)"
                color="pink"
              />
            </>
          ) : (
            <>
              <FormInput
                label="Language (EN)"
                name="name_en"
                value={form.name_en}
                onChange={handleChange}
                placeholder="e.g. Spanish"
                color="pink"
              />
              <FormInput
                label="Level (EN)"
                name="level_en"
                value={form.level_en}
                onChange={handleChange}
                placeholder="e.g. Native, Intermediate (Optional)"
                color="pink"
              />
            </>
          )}

          <div className="flex gap-3 pt-4 border-t border-pink-200 mt-6">
            <button
              type="submit"
              className="px-6 py-2.5 text-white rounded-lg shadow-sm font-bold transition bg-pink-600 hover:bg-pink-700"
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
            ¿Eliminar Idioma?
          </h3>
          <p className="text-gray-500 text-center text-sm mb-6">
            Se eliminará <strong>"{itemToDelete?.name}"</strong>.
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
