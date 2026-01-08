import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { getTechColor } from "../utils/colors";
import ImageUpload from "../components/ImageUpload";

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados globales
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Estados Perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  // Estados Proyecto
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    technologies: "",
  });
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Estados Experiencia Laboral
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null); // <--- NUEVO
  const [experienceForm, setExperienceForm] = useState({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    isVisible: true,
  });

  // Utilidades
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Actualidad";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  // Helper para formato input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // Carga incial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, experienceRes] = await Promise.all([
          fetch(`${API_URL}/profile`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/experience`),
        ]);

        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();
        const experienceData = await experienceRes.json();

        setProfile(profileData);
        setProfileForm(profileData);
        setProjects(projectsData);
        setExperiences(experienceData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        showNotification("Error cargando datos", "error");
      }
    };
    fetchData();
  }, []);

  // Lógica perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        setProfile(await res.json());
        setIsEditingProfile(false);
        showNotification("Perfil actualizado", "success");
      }
    } catch (error) {
      showNotification("Error al actualizar perfil", "error");
    }
  };

  // Lógica proyectos
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditingProject = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image || "",
      link: project.repoUrl || "",
      technologies: project.techStack ? project.techStack.join(", ") : "",
    });
    setIsProjectFormOpen(true);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const resetProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      description: "",
      image: "",
      link: "",
      technologies: "",
    });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const techArray = projectForm.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...projectForm,
        technologies: techArray,
        isVisible: true,
      };

      const method = editingProjectId ? "PUT" : "POST";
      const url = editingProjectId
        ? `${API_URL}/projects/${editingProjectId}`
        : `${API_URL}/projects`;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProject = await res.json();
        if (editingProjectId) {
          setProjects(
            projects.map((p) => (p.id === editingProjectId ? savedProject : p))
          );
          showNotification("Proyecto actualizado", "success");
        } else {
          setProjects([savedProject, ...projects]);
          showNotification("Proyecto creado", "success");
        }
        resetProjectForm();
      } else {
        showNotification("Error al guardar proyecto", "error");
      }
    } catch (error) {
      showNotification("Error de conexión", "error");
    }
  };

  const requestDeleteProject = (project) => {
    setProjectToDelete(project);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch(`${API_URL}/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectToDelete.id));
        showNotification("Proyecto eliminado", "success");
      }
    } catch (error) {
      showNotification("Error al eliminar", "error");
    } finally {
      setProjectToDelete(null);
    }
  };

  // Lógica experiencia
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperienceForm((prev) => ({ ...prev, [name]: value }));
  };

  // Iniciar Edición
  const startEditingExperience = (exp) => {
    setEditingExperienceId(exp.id);
    setExperienceForm({
      position: exp.position,
      company: exp.company,
      startDate: formatDateForInput(exp.startDate),
      endDate: formatDateForInput(exp.endDate),
      description: exp.description,
      isVisible: exp.isVisible,
    });
    setIsExperienceFormOpen(true);
    // Scroll a la zona del formulario de experiencia
    window.scrollTo({ top: 800, behavior: "smooth" });
  };

  // Resetear Formulario
  const resetExperienceForm = () => {
    setIsExperienceFormOpen(false);
    setEditingExperienceId(null);
    setExperienceForm({
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      isVisible: true,
    });
  };

  // Guardar (Crear o Editar)
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...experienceForm,
        endDate: experienceForm.endDate || null,
      };

      const method = editingExperienceId ? "PUT" : "POST";
      const url = editingExperienceId
        ? `${API_URL}/experience/${editingExperienceId}`
        : `${API_URL}/experience`;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedExp = await res.json();

        setExperiences((prev) => {
          let updatedList;
          if (editingExperienceId) {
            // Reemplazar la existente
            updatedList = prev.map((e) =>
              e.id === editingExperienceId ? savedExp : e
            );
          } else {
            // Añadir nueva
            updatedList = [...prev, savedExp];
          }
          // Reordenar siempre por fecha
          return updatedList.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          );
        });

        resetExperienceForm();
        showNotification(
          editingExperienceId
            ? "Experiencia actualizada"
            : "Experiencia añadida",
          "success"
        );
      } else {
        showNotification("Error al guardar experiencia", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm("¿Eliminar esta experiencia?")) return;
    try {
      const res = await fetch(`${API_URL}/experience/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
        showNotification("Experiencia eliminada", "success");
      }
    } catch (error) {
      showNotification("Error al eliminar", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando panel...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 relative">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Career Hub Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            {profile?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 border border-red-100 px-3 py-1 rounded hover:bg-red-50 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="bg-blue-600 h-32 w-full"></div>
          <div className="px-8 pb-8">
            <div className="-mt-12 mb-6">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                {profile?.name ? profile.name.charAt(0) : "A"}
              </div>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4 animate-fade-in bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">
                  Editando Perfil
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500">
                      Nombre
                    </label>
                    <input
                      name="name"
                      value={profileForm.name || ""}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500">
                      Título
                    </label>
                    <input
                      name="title"
                      value={profileForm.title || ""}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">
                    Resumen
                  </label>
                  <textarea
                    name="summary"
                    value={profileForm.summary || ""}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={profileForm.bio || ""}
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile?.name}
                    </h2>
                    <p className="text-blue-600 font-medium">
                      {profile?.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition border border-gray-200"
                  >
                    Editar Perfil
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Resumen
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {profile?.summary}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Biografía
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {profile?.bio}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Proyectos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mis Proyectos</h2>
            {!isProjectFormOpen && (
              <button
                onClick={() => {
                  resetProjectForm();
                  setIsProjectFormOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                + Nuevo Proyecto
              </button>
            )}
          </div>

          {isProjectFormOpen && (
            <div
              className={`mb-8 p-6 rounded-xl border animate-fade-in ${
                editingProjectId
                  ? "bg-indigo-50 border-indigo-100"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              <h3
                className={`font-bold mb-4 ${
                  editingProjectId ? "text-indigo-900" : "text-blue-900"
                }`}
              >
                {editingProjectId
                  ? "✏️ Editar Proyecto"
                  : "✨ Añadir Nuevo Proyecto"}
              </h3>
              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej: E-commerce con React"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <ImageUpload
                      value={projectForm.image}
                      onChange={(newUrl) =>
                        setProjectForm((prev) => ({ ...prev, image: newUrl }))
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
                      value={projectForm.technologies}
                      onChange={handleProjectChange}
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
                      value={projectForm.link}
                      onChange={handleProjectChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded shadow-sm font-medium transition ${
                      editingProjectId
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {editingProjectId
                      ? "Actualizar Proyecto"
                      : "Crear Proyecto"}
                  </button>
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {projects.length === 0 && !isProjectFormOpen ? (
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
                        onClick={() => startEditingProject(project)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => requestDeleteProject(project)}
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
        </div>

        {/* Experiencia laboral */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Experiencia Laboral
            </h2>
            {!isExperienceFormOpen && (
              <button
                onClick={() => {
                  resetExperienceForm();
                  setIsExperienceFormOpen(true);
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
              >
                + Añadir Experiencia
              </button>
            )}
          </div>

          {isExperienceFormOpen && (
            <div
              className={`mb-8 p-6 rounded-xl border animate-fade-in ${
                editingExperienceId
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-green-50 border-green-100"
              }`}
            >
              <h3
                className={`font-bold mb-4 ${
                  editingExperienceId ? "text-emerald-900" : "text-green-900"
                }`}
              >
                {editingExperienceId
                  ? "💼 Editar Experiencia"
                  : "💼 Nueva Experiencia"}
              </h3>
              <form onSubmit={handleSaveExperience} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cargo / Puesto
                    </label>
                    <input
                      name="position"
                      value={experienceForm.position}
                      onChange={handleExperienceChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Ej: Senior Frontend Developer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      name="company"
                      value={experienceForm.company}
                      onChange={handleExperienceChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Ej: Google"
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
                      value={experienceForm.startDate}
                      onChange={handleExperienceChange}
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
                      value={experienceForm.endDate}
                      onChange={handleExperienceChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={experienceForm.description}
                    onChange={handleExperienceChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    rows="3"
                    placeholder="Responsabilidades y logros..."
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded shadow-sm font-medium transition ${
                      editingExperienceId
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {editingExperienceId
                      ? "Actualizar Experiencia"
                      : "Guardar Experiencia"}
                  </button>
                  <button
                    type="button"
                    onClick={resetExperienceForm}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {experiences.length === 0 && !isExperienceFormOpen ? (
            <p className="text-gray-400 text-center py-10 italic">
              Aún no has añadido experiencia laboral.
            </p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {exp.position}
                    </h4>
                    <p className="text-green-700 font-medium mb-1">
                      {exp.company}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </p>
                    <p className="text-gray-600 text-sm">{exp.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingExperience(exp)}
                      className="text-gray-400 hover:text-emerald-600 transition p-2 hover:bg-emerald-50 rounded"
                      title="Editar experiencia"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded"
                      title="Eliminar experiencia"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar Proyecto?
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6">
                Se eliminará <strong>"{projectToDelete.title}"</strong>. Esta
                acción es irreversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteProject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in z-50 flex items-center gap-2 ${
            notification.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          <span>{notification.type === "error" ? "❌" : "✅"}</span>
          {notification.message}
        </div>
      )}
    </div>
  );
}
