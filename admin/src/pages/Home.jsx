import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { getTechColor } from "../utils/colors";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargamos datos públicos
    Promise.all([
      fetch(`${API_URL}/profile`).then((res) => res.json()),
      fetch(`${API_URL}/projects`).then((res) => res.json()),
    ])
      .then(([profileData, projectsData]) => {
        setProfile(profileData);
        // Solo mostramos proyectos marcados como visibles (aunque ahora todos lo son por defecto)
        setProjects(projectsData.filter((p) => p.isVisible));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando portafolio...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Cabecera principal */}
      <header className="bg-white shadow-sm pb-12 pt-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl border-4 border-white">
              {profile?.name ? profile.name.charAt(0) : "I"}
            </div>
            {/* Indicador de "Open to work" opcional */}
            <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* Texto Intro */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
              {profile?.name || "Cargando..."}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 font-medium mb-4">
              {profile?.title || "Desarrollador"}
            </h2>
            <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
              {profile?.summary}
            </p>

            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              <a
                href="#projects"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Ver Proyectos
              </a>
              <a
                href={`mailto:${profile?.email}`}
                className="px-6 py-3 bg-white text-gray-700 font-bold rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Sección sobre mí */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
            Sobre mí
          </h3>
          <p className="text-gray-700 text-lg leading-loose whitespace-pre-line">
            {profile?.bio}
          </p>
        </div>
      </section>

      {/* Sección proyectos */}
      <section id="projects" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Proyectos Destacados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col h-full"
              >
                {/* Imagen */}
                <div className="h-48 bg-gray-200 relative overflow-hidden group">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Sin imagen preview
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getTechColor(
                          tech
                        )}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  <a
                    href={project.repoUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full block text-center py-2 rounded-lg font-bold transition ${
                      project.repoUrl
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {project.repoUrl ? "Ver Código / Demo" : "Próximamente"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} {profile?.name}. Construido con React &
          Node.
        </p>
        <div className="mt-2">
          <a
            href="/login"
            className="text-gray-400 hover:text-gray-600 underline"
          >
            Admin Login
          </a>
        </div>
      </footer>
    </div>
  );
}
