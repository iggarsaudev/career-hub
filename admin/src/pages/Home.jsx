import { useState, useEffect } from "react";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
import Timeline from "../components/Timeline";
import ProjectCard from "../components/ProjectCard";
import EducationList from "../components/EducationList";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/profile`).then((res) => res.json()),
      fetch(`${API_URL}/projects`).then((res) => res.json()),
      fetch(`${API_URL}/experience`).then((res) => res.json()),
      fetch(`${API_URL}/education`).then((res) => res.json()),
    ])
      .then(([profileData, projectsData, experienceData, educationData]) => {
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
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const displayTitle =
    language === "en" && profile?.title_en ? profile.title_en : profile?.title;
  const displaySummary =
    language === "en" && profile?.summary_en
      ? profile.summary_en
      : profile?.summary;
  const displayBio =
    language === "en" && profile?.bio_en ? profile.bio_en : profile?.bio;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {language === "en" ? "Loading portfolio..." : "Cargando portafolio..."}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar profile={profile} />

      {/* Hero Section */}
      <header
        id="home"
        className="bg-white pb-12 pt-28 px-6 border-b border-gray-100"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl border-4 border-white overflow-hidden transition transform group-hover:scale-105">
              {profile?.name ? profile.name.charAt(0) : "I"}
            </div>
            <div
              className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-white"
              title={language === "en" ? "Available" : "Disponible"}
            ></div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
              {profile?.name ||
                (language === "en" ? "Loading..." : "Cargando...")}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 font-medium mb-4">
              {displayTitle ||
                (language === "en" ? "Developer" : "Desarrollador")}
            </h2>
            <p className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-6">
              {displaySummary}
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href={`mailto:${profile?.email}`}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-blue-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {language === "en"
                  ? "📬 Send me an email"
                  : "📬 Envíame un correo"}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Sección sobre mí */}
      <section id="about" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-blue-600 inline-block"></span>
            {language === "en" ? "About Me" : "Sobre mí"}
          </h3>
          <p className="text-gray-700 text-lg leading-loose whitespace-pre-line">
            {displayBio}
          </p>
        </div>
      </section>

      {/* Sección experiencia */}
      {experiences.length > 0 && (
        <section
          id="experience"
          className="bg-gray-50 py-20 px-6 border-t border-gray-200"
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-10 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-green-600 inline-block"></span>
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
          className="bg-white py-20 px-6 border-t border-gray-200"
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-10 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-purple-600 inline-block"></span>
              {language === "en" ? "Education" : "Formación Académica"}
            </h3>
            <EducationList educations={educations} />
          </div>
        </section>
      )}

      {/* Sección proyectos */}
      <section
        id="projects"
        className="py-20 px-6 bg-gray-50 border-t border-gray-200"
      >
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-10 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-indigo-600 inline-block"></span>
            {language === "en" ? "Featured Projects" : "Proyectos Destacados"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-10 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} {profile?.name}.
        </p>
      </footer>
    </div>
  );
}
