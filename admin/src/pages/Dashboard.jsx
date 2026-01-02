import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Estados de edición Perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  // Estados de creación Proyecto
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    technologies: "",
  });

  // Esta función elige un color basado en el nombre de la tecnología
  const getTechColor = (techName) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-teal-100 text-teal-800 border-teal-200",
    ];
    // Sumamos los códigos de las letras para elegir siempre el mismo color para el mismo nombre
    let hash = 0;
    for (let i = 0; i < techName.length; i++) {
      hash += techName.charCodeAt(i);
    }
    return colors[hash % colors.length];
  };

  // Función para mostrar las notificaciones
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    // Se oculta sola a los 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Carga inicial
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/profile`).then((res) => res.json()),
      fetch(`${API_URL}/projects`).then((res) => res.json()),
    ])
      .then(([profileData, projectsData]) => {
        setProfile(profileData);
        setProfileForm(profileData);
        setProjects(projectsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  // Handles perfil
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
        showNotification("Perfil actualizado correctamente", "success");
      }
    } catch (error) {
      showNotification("Error al actualizar perfil", "error");
    }
  };

  // Handles proyectos
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      // Convertimos el texto "React, Node" en array ["React", "Node"]
      const techArray = projectForm.technologies
        .split(",")
        .map((t) => t.trim()) // quitamos espacios
        .filter((t) => t.length > 0); // quitamos vacíos

      const payload = {
        ...projectForm,
        technologies: techArray, // enviamos el array al backend
      };

      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects([newProject, ...projects]);
        setIsCreatingProject(false);
        setProjectForm({
          title: "",
          description: "",
          image: "",
          link: "",
          technologies: "",
        });
        showNotification("Proyecto creado con éxito", "success");
      } else {
        showNotification("Error al crear proyecto", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Error de conexión con el servidor", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando panel...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navbar */}
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

      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Sección perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="bg-blue-600 h-32 w-full"></div>

          <div className="px-8 pb-8">
            <div className="-mt-12 mb-6">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                {profile?.name ? profile.name.charAt(0) : "A"}
              </div>
            </div>

            {isEditingProfile ? (
              /* Edición perfil */
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
                      Título Profesional
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
                    Resumen Corto
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
                    Biografía Completa
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
                    Guardar Cambios
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
              /* Vista perfil */
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

        {/* Sección proyectos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mis Proyectos</h2>
            {!isCreatingProject && (
              <button
                onClick={() => setIsCreatingProject(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                + Nuevo Proyecto
              </button>
            )}
          </div>

          {/* Nuevo proyecto */}
          {isCreatingProject && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
              <h3 className="font-bold text-blue-900 mb-4">
                Añadir Nuevo Proyecto
              </h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">
                    Título
                  </label>
                  <input
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectChange}
                    className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej: E-commerce con React"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectChange}
                    className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    placeholder="Describe brevemente las tecnologías usadas..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">
                    Tecnologías (separadas por comas)
                  </label>
                  <input
                    name="technologies"
                    value={projectForm.technologies}
                    onChange={handleProjectChange}
                    className="w-full p-2 border border-blue-200 rounded outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: React, Node.js, Tailwind, MongoDB"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-800 mb-1">
                      URL Imagen
                    </label>
                    <input
                      name="image"
                      value={projectForm.image}
                      onChange={handleProjectChange}
                      className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-800 mb-1">
                      Enlace al Proyecto
                    </label>
                    <input
                      name="link"
                      value={projectForm.link}
                      onChange={handleProjectChange}
                      className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-sm font-medium"
                  >
                    Crear Proyecto
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingProject(false)}
                    className="px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de proyectos */}
          {projects.length === 0 && !isCreatingProject ? (
            <p className="text-gray-400 text-center py-10 italic">
              No tienes proyectos visibles. ¡Añade uno!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 bg-white"
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
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                      {project.title}
                    </h3>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTechColor(
                              tech
                            )}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-5">
                      {project.description}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <a
                        href={project.repoUrl ? "Ver Proyecto ↗" : "Sin enlace"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                          project.link
                            ? "text-blue-700 bg-blue-50 hover:bg-blue-100"
                            : "text-gray-400 bg-gray-100 cursor-not-allowed"
                        }`}
                      >
                        {project.link ? "Ver Proyecto ↗" : "Sin enlace"}
                      </a>
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition">
                        <button
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Componente de notificación */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 animate-fade-in flex items-center gap-2 z-50 ${
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
