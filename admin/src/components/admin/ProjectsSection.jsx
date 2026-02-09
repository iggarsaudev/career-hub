import { useState } from "react";
import { API_URL } from "../../config";
import { getTechColor } from "../../utils/colors";

// Hooks
import { useForm } from "../../hooks/useForm";

// Componentes UI
import Modal from "./Modal";
import AdminItemCard from "./AdminItemCard";
import ImageUpload from "../../components/ImageUpload";
import { FormInput, FormTextarea } from "./FormElements";
import PdfVisibilityToggle from "./PdfToggle";

export default function ProjectsSection({
  projects,
  setProjects,
  showNotification,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("es");
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estado inicial del formulario
  const initialFormState = {
    title: "",
    title_en: "",
    description: "",
    description_en: "",
    image: "",
    link: "", // Usamos 'link' en el form visualmente
    technologies: "",
    isVisibleInPdf: true,
  };

  // Usamos el hook personalizado
  const { form, handleChange, setField, resetForm, setForm } =
    useForm(initialFormState);

  // Generar Slug Automáticamente
  const createSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Espacios a guiones
      .replace(/[^\w\-]+/g, "") // Quitar caracteres raros
      .replace(/\-\-+/g, "-"); // Quitar guiones dobles
  };

  // Abrir modal para crear o editar
  const startEditing = (project = null) => {
    if (project) {
      setEditingId(project.id);
      setForm({
        title: project.title || "",
        title_en: project.title_en || "",
        description: project.description || "",
        description_en: project.description_en || "",
        image: project.image || "",
        link: project.repoUrl || "", // Mapeamos repoUrl a link al cargar
        technologies: project.techStack ? project.techStack.join(", ") : "",
        isVisibleInPdf: project.isVisibleInPdf ?? true,
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

  // Guardar datos
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const techArray = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...form,
        techStack: techArray, // BD espera 'techStack'
        isVisible: true,
        repoUrl: form.link, // BD espera 'repoUrl', le pasamos lo del input 'link'
        demoUrl: form.demo,
        // Si estamos creando (no editando), generamos el slug
        slug: editingId ? undefined : createSlug(form.title),
      };

      // Limpiamos campos que no van a la BD para evitar errores
      delete payload.technologies;
      delete payload.link;

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
        handleCloseModal();
        showNotification(
          editingId ? "Proyecto actualizado" : "Proyecto creado",
          "success",
        );
      } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        showNotification(
          "Error al guardar: " + (errorData.error || "Desconocido"),
          "error",
        );
      }
    } catch (error) {
      console.error(error);
      showNotification("Error de conexión", "error");
    }
  };

  // Confirmar borrado
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

  const themeColor = editingId ? "indigo" : "blue";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Mis Proyectos</h2>
        <button
          onClick={() => startEditing()} // Sin argumentos = Crear nuevo
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          + Nuevo Proyecto
        </button>
      </div>

      {/* Tarjetas */}
      {projects.length === 0 ? (
        <p className="text-gray-400 text-center py-10 italic">
          No tienes proyectos. ¡Añade uno!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <AdminItemCard
              key={project.id}
              title={project.title}
              subtitle={project.title_en ? `🇺🇸 ${project.title_en}` : null}
              image={project.image}
              withImageSection={true}
              // Badges superiores (PDF, Idioma)
              topBadges={
                <>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      project.isVisibleInPdf
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    PDF: {project.isVisibleInPdf ? "SÍ" : "NO"}
                  </span>
                  {project.title_en && (
                    <span className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      EN/ES
                    </span>
                  )}
                </>
              }
              // Tags del Tech Stack
              tags={project.techStack?.map((tech) => ({
                text: tech,
                colorClass: getTechColor(tech),
              }))}
              // Acciones
              onEdit={() => startEditing(project)}
              onDelete={() => setItemToDelete(project)}
            >
              {/* Contenido (Descripción) */}
              {project.description}
            </AdminItemCard>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        className={
          editingId
            ? "bg-indigo-50 border-indigo-100"
            : "bg-blue-50 border-blue-100"
        }
      >
        <div className="flex justify-between items-start mb-6">
          <h3
            className={`font-bold text-xl ${editingId ? "text-indigo-900" : "text-blue-900"}`}
          >
            {editingId ? "✏️ Editar Proyecto" : "✨ Añadir Nuevo Proyecto"}
          </h3>
          <div className="flex bg-white/50 rounded-lg p-1 text-sm font-medium border border-blue-200">
            <button
              type="button"
              onClick={() => setActiveTab("es")}
              className={`px-3 py-1 rounded-md transition-all ${activeTab === "es" ? "bg-white text-blue-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Español
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-3 py-1 rounded-md transition-all ${activeTab === "en" ? "bg-white text-blue-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Inglés
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === "es" ? (
            <>
              <FormInput
                label="Título (ES)"
                name="title"
                value={form.title}
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
                label="Title (EN)"
                name="title_en"
                value={form.title_en}
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

          <div className="col-span-1 md:col-span-2">
            <ImageUpload
              value={form.image}
              onChange={(url) => setField("image", url)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Tecnologías (Separa por comas)"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              color={themeColor}
            />
            <FormInput
              label="Enlace GitHub"
              name="link"
              value={form.link}
              onChange={handleChange}
              color={themeColor}
            />
            <FormInput
              label="Enlace Demo"
              name="demo"
              value={form.demo || ""}
              onChange={handleChange}
              color={themeColor}
              placeholder="https://..."
            />
          </div>

          <PdfVisibilityToggle
            checked={form.isVisibleInPdf}
            onChange={(checked) => setField("isVisibleInPdf", checked)}
            color={themeColor}
            label="Incluir este proyecto en el CV (PDF)"
          />

          <div
            className={`flex gap-3 pt-4 border-t border-${themeColor}-200 mt-6`}
          >
            <button
              type="submit"
              className={`px-6 py-2.5 text-white rounded-lg shadow-sm font-bold transition ${editingId ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {editingId ? "Actualizar" : "Crear"}
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
            ¿Eliminar Proyecto?
          </h3>
          <p className="text-gray-500 text-center text-sm mb-6">
            Se eliminará <strong>"{itemToDelete?.title}"</strong>.
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
