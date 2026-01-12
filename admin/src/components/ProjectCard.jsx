import { getTechColor } from "../utils/colors";

export default function ProjectCard({ project }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-200 flex flex-col h-full group">
      {/* Imagen */}
      <div className="h-48 bg-gray-100 relative overflow-hidden border-b border-gray-100">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            <span className="text-4xl">💻</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border ${getTechColor(
                tech
              )}`}
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mb-6 flex-grow line-clamp-3 leading-relaxed text-sm">
          {project.description}
        </p>

        <a
          href={project.repoUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-2.5 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
            project.repoUrl
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {project.repoUrl ? (
            <>
              {/* Icono de código simple */}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Ver Código
            </>
          ) : (
            "Próximamente"
          )}
        </a>
      </div>
    </article>
  );
}
