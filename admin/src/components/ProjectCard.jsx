import { getTechColor } from "../utils/colors";
import { useLanguage } from "../context/LanguageContext";

export default function ProjectCard({ project }) {
  const { language } = useLanguage();

  const title =
    language === "en" && project.title_en ? project.title_en : project.title;
  const description =
    language === "en" && project.description_en
      ? project.description_en
      : project.description;

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-200 dark:border-gray-800 flex flex-col h-full group">
      {/* Imagen */}
      <div className="h-48 bg-gray-100 dark:bg-gray-800 relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {project.image ? (
          <img
            src={project.image}
            alt={title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-600 text-sm">
            <span className="text-4xl">💻</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-3 leading-relaxed text-sm">
          {description}
        </p>

        <a
          href={project.repoUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-2.5 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
            project.repoUrl
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md hover:shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          }`}
        >
          {language === "en"
            ? project.repoUrl
              ? "</> View Code"
              : "Coming Soon"
            : project.repoUrl
              ? "</> Ver Código"
              : "Próximamente"}
        </a>
      </div>
    </article>
  );
}
