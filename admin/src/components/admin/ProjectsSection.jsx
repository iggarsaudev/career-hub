import { useState } from "react";
import { API_URL } from "../../config";
import { getTechColor } from "../../utils/colors";
import ImageUpload from "../../components/ImageUpload";

export default function ProjectsSection({
  projects,
  setProjects,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    technologies: "",
  });

  const [itemToDelete, setItemToDelete] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image || "",
      link: project.repoUrl || "",
      technologies: project.techStack ? project.techStack.join(", ") : "",
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      image: "",
      link: "",
      technologies: "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const techArray = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const payload = { ...form, technologies: techArray, isVisible: true };
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/projects/${editingId}`
        : `${API_URL}/projects`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setProjects((prev) => {
          if (editingId)
            return prev.map((p) => (p.id === editingId ? saved : p));
          return [saved, ...prev];
        });
        resetForm();
        showNotification(
          editingId ? "Proyecto actualizado" : "Proyecto creado",
          "success"
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
      const res = await fetch(`${API_URL}/projects/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== itemToDelete.id));
        showNotification("Proyecto eliminado", "success");
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Mis Proyectos</h2>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            + Nuevo Proyecto
          </button>
        )}
      </div>

      {isFormOpen && (
        <div
          className={`mb-8 p-6 rounded-xl border animate-fade-in ${
            editingId
              ? "bg-indigo-50 border-indigo-100"
              : "bg-blue-50 border-blue-100"
          }`}
        >
          <h3
            className={`font-bold mb-4 ${
              editingId ? "text-indigo-900" : "text-blue-900"
            }`}
          >
            {editingId ? "✏️ Editar Proyecto" : "✨ Añadir Nuevo Proyecto"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Título
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <ImageUpload
                  value={form.image}
                  onChange={(url) =>
                    setForm((prev) => ({ ...prev, image: url }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tecnologías
                </label>
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: React, Node.js"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Enlace Repo
                </label>
                <input
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded shadow-sm font-medium transition ${
                  editingId
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {editingId ? "Actualizar" : "Crear"}
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

      {projects.length === 0 && !isFormOpen ? (
        <p className="text-gray-400 text-center py-10 italic">
          No tienes proyectos.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 bg-white flex flex-col"
            >
              <div className="h-48 bg-gray-100 w-full relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <span className="text-4xl mb-2">📷</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack?.map((tech, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTechColor(
                        tech
                      )}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => startEditing(project)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setItemToDelete(project)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          {/* ... Mismo contenido del modal de antes, adaptado ... */}
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar Proyecto?
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6">
                Se eliminará <strong>"{itemToDelete.title}"</strong>.
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
