import { useState, useEffect } from "react";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
import Timeline from "../components/Timeline";
import ProjectCard from "../components/ProjectCard";
import EducationList from "../components/EducationList";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/profile`).then((res) => res.json()),
      fetch(`${API_URL}/projects`).then((res) => res.json()),
      fetch(`${API_URL}/experience`).then((res) => res.json()),
      fetch(`${API_URL}/education`).then((res) => res.json()),
      fetch(`${API_URL}/skills`).then((res) => res.json()),
      fetch(`${API_URL}/languages`).then((res) => res.json()),
    ])
      .then(
        ([
          profileData,
          projectsData,
          experienceData,
          educationData,
          skillsData,
          languagesData,
        ]) => {
          setProfile(profileData);
          setProjects(projectsData.filter((p) => p.isVisible));
          setExperiences(
            Array.isArray(experienceData)
              ? experienceData.filter((e) => e.isVisible)
              : [],
          );
          setEducations(
            Array.isArray(educationData)
              ? educationData.filter((e) => e.isVisible)
              : [],
          );
          setSkills(skillsData);
          setLanguages(languagesData);
          setLoading(false);
        },
      )
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Función para mostrar notificaciones
  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    // La alerta desaparece sola a los 4 segundos
    setTimeout(() => setNotification(null), 4000);
  };

  // Función descarga cv
  const handleDownloadCV = async (e) => {
    e.preventDefault();
    setIsDownloading(true);

    try {
      const res = await fetch(`${API_URL}/cv`);

      // Si el servidor dice que no existe (404), usamos nuestra notificación
      if (res.status === 404) {
        showNotification(
          language === "en"
            ? "The CV has not been published yet."
            : "El CV aún no ha sido publicado por el administrador.",
          "warning",
        );
        return;
      }

      if (!res.ok) throw new Error("Error downloading");

      // Convertimos la respuesta en un archivo descargable
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Nombre del archivo limpio
      a.download = `CV_${profile?.name?.replace(/\s+/g, "_") || "CV_Ignacio_Garcia_Sausor"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Notificación de éxito
      showNotification(
        language === "en" ? "Download started!" : "¡Descarga iniciada!",
        "success",
      );
    } catch (error) {
      console.error(error);
      showNotification(
        language === "en"
          ? "Connection error"
          : "Error de conexión al intentar descargar",
        "error",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const displayTitle =
    language === "en" && profile?.title_en ? profile.title_en : profile?.title;
  const displaySummary =
    language === "en" && profile?.summary_en
      ? profile.summary_en
      : profile?.summary;
  const displayBio =
    language === "en" && profile?.bio_en ? profile.bio_en : profile?.bio;

  // Carga de logo
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 z-50">
        {/* Logo efecto pulse */}
        <div className="mb-8 relative">
          <img
            src="/mi-logo.png"
            alt="Cargando..."
            className="w-48 h-auto object-contain animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          />
        </div>

        {/* Indicador de carga */}
        <div className="flex flex-col items-center gap-2">
          {/* Spinner pequeño y discreto */}
          <div className="w-6 h-6 border-2 border-gray-700 border-t-cyan-400 rounded-full animate-spin"></div>
          <span className="text-gray-500 font-mono text-xs tracking-[0.2em] uppercase mt-2">
            {language === "en"
              ? "Loading portfolio..."
              : "Cargando portafolio..."}
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300 relative">
      {notification && (
        <div
          className={`fixed top-24 right-5 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-medium transform transition-all duration-300 animate-fade-in-down flex items-center gap-3 ${
            notification.type === "warning"
              ? "bg-yellow-500"
              : notification.type === "success"
                ? "bg-green-600"
                : "bg-red-500"
          }`}
        >
          <span>
            {notification.type === "warning"
              ? "✋"
              : notification.type === "success"
                ? "✅"
                : "❌"}
          </span>
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-4 opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <Navbar profile={profile} onDownloadCV={handleDownloadCV} />

      {/* Hero Section */}
      <header
        id="home"
        className="bg-white dark:bg-gray-900 pb-12 pt-28 px-6 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex flex-col items-center gap-6 shrink-0">
            {/* Foto */}
            <div className="relative group">
              <div className="h-40 w-40 md:h-48 md:w-48 rounded-full bg-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl border-4 border-white dark:border-gray-800 overflow-hidden transition transform group-hover:scale-105">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover object-top"
                  />
                ) : profile?.name ? (
                  profile.name.charAt(0)
                ) : (
                  "I"
                )}
              </div>
            </div>

            <button
              onClick={handleDownloadCV}
              disabled={isDownloading}
              className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {isDownloading
                ? language === "en"
                  ? "Wait..."
                  : "Espera..."
                : language === "en"
                  ? "Download CV"
                  : "Descargar CV"}
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              {profile?.name ||
                (language === "en" ? "Loading..." : "Cargando...")}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-4">
              {displayTitle ||
                (language === "en" ? "Developer" : "Desarrollador")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-lg leading-relaxed mb-6">
              {displaySummary}
            </p>
          </div>
        </div>
      </header>

      {/* Sección sobre mí */}
      <section
        id="about"
        className="bg-white dark:bg-gray-900 py-20 px-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-600 dark:bg-blue-400 inline-block"></span>
            {language === "en" ? "About Me" : "Sobre mí"}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-loose whitespace-pre-line">
            {displayBio}
          </p>
        </div>
      </section>

      {/* Sección proyectos */}
      <section
        id="projects"
        className="py-20 px-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-10 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 inline-block"></span>
            {language === "en" ? "Featured Projects" : "Proyectos Destacados"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Sección skills e idiomas */}
      {(skills.length > 0 || languages.length > 0) && (
        <Skills skills={skills} languages={languages} />
      )}

      {/* Sección experiencia */}
      {experiences.length > 0 && (
        <section
          id="experience"
          className="bg-gray-50 dark:bg-gray-950 py-20 px-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-10 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-green-600 dark:bg-green-400 inline-block"></span>
              {language === "en"
                ? "Professional Experience"
                : "Trayectoria Profesional"}
            </h3>
            <Timeline experiences={experiences} />
          </div>
        </section>
      )}

      {/* Sección formación */}
      {educations.length > 0 && (
        <section
          id="education"
          className="bg-white dark:bg-gray-900 py-20 px-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-10 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600 dark:bg-purple-400 inline-block"></span>
              {language === "en" ? "Education" : "Formación Académica"}
            </h3>
            <EducationList educations={educations} />
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer profile={profile} />
    </div>
  );
}
