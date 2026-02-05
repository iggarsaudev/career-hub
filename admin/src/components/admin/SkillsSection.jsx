import { useState } from "react";
import { API_URL } from "../../config";
import { getTechColor } from "../../utils/colors";
import { useForm } from "../../hooks/useForm";
import Modal from "./Modal";
import AdminItemCard from "./AdminItemCard";
import { FormInput } from "./FormElements";

export default function SkillsSection({ skills, setSkills, showNotification }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es");
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estado inicial
  const initialFormState = {
    name: "",
    category: "",
    category_en: "",
    isVisible: true,
  };

  const { form, handleChange, resetForm, setForm } = useForm(initialFormState);

  const startEditing = (skill = null) => {
    if (skill) {
      setEditingId(skill.id);
      setForm({
        name: skill.name || "",
        category: skill.category || "",
        category_en: skill.category_en || "",
        isVisible: skill.isVisible ?? true,
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
        ? `${API_URL}/skills/${editingId}`
        : `${API_URL}/skills`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        setSkills((prev) => {
          if (editingId)
            return prev.map((s) => (s.id === editingId ? saved : s));
          return [...prev, saved];
        });
        handleCloseModal();
        showNotification(
          editingId ? "Skill actualizada" : "Skill añadida",
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
      const res = await fetch(`${API_URL}/skills/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== itemToDelete.id));
        showNotification("Skill eliminada", "success");
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch (error) {
      showNotification("Error de conexión", "error");
    } finally {
      setItemToDelete(null);
    }
  };

  const themeColor = "indigo";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Habilidades (Skills)
        </h2>
        <button
          onClick={() => startEditing()}
          className={`px-4 py-2 bg-${themeColor}-600 text-white text-sm font-bold rounded-lg hover:bg-${themeColor}-700 transition shadow-sm`}
        >
          + Nueva Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-400 text-center py-10 italic">
          No has añadido habilidades.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="h-full">
              <AdminItemCard
                title={skill.name}
                subtitle={skill.category}
                // Si existe categoría en inglés, la mostramos como tag
                tags={
                  skill.category_en
                    ? [
                        {
                          text: `🇺🇸 ${skill.category_en}`,
                          colorClass:
                            "bg-indigo-50 text-indigo-500 border-indigo-100",
                        },
                      ]
                    : []
                }
                topBadges={
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTechColor(skill.name)}`}
                  >
                    {skill.name}
                  </span>
                }
                withImageSection={false}
                onEdit={() => startEditing(skill)}
                onDelete={() => setItemToDelete(skill)}
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
            ? `bg-${themeColor}-50 border-${themeColor}-100`
            : `bg-gray-50 border-gray-200`
        }
      >
        <div className="flex justify-between items-start mb-6">
          <h3
            className={`font-bold text-xl ${editingId ? `text-${themeColor}-900` : "text-gray-800"}`}
          >
            {editingId ? "🛠️ Editar Skill" : "⚡ Nueva Skill"}
          </h3>
          <div className="flex bg-white/50 rounded-lg p-1 text-sm font-medium border border-indigo-200">
            <button
              type="button"
              onClick={() => setActiveTab("es")}
              className={`px-3 py-1 rounded-md transition-all ${activeTab === "es" ? "bg-white text-indigo-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Español
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-3 py-1 rounded-md transition-all ${activeTab === "en" ? "bg-white text-indigo-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Inglés
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Nombre (Universal)"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: React, Python"
            color={themeColor}
            required
          />

          <hr className={`border-${themeColor}-200/50 my-2`} />

          {activeTab === "es" ? (
            <FormInput
              label="Categoría (ES)"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej: Librerías, Herramientas"
              color={themeColor}
            />
          ) : (
            <FormInput
              label="Category (EN)"
              name="category_en"
              value={form.category_en}
              onChange={handleChange}
              placeholder="e.g. Libraries, Tools"
              color={themeColor}
            />
          )}

          <div
            className={`flex gap-3 pt-4 border-t border-${themeColor}-200 mt-6`}
          >
            <button
              type="submit"
              className={`px-6 py-2.5 text-white rounded-lg shadow-sm font-bold transition bg-${themeColor}-600 hover:bg-${themeColor}-700`}
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
            ¿Eliminar Skill?
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
