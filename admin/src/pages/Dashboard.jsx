import { Link } from "react-router-dom";
import { FaFilePdf, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

import ProfileSection from "../components/admin/ProfileSection";
import ProjectsSection from "../components/admin/ProjectsSection";
import ExperienceSection from "../components/admin/ExperienceSection";
import EducationSection from "../components/admin/EducationSection";
import SkillsSection from "../components/admin/SkillsSection";
import LanguageSection from "../components/admin/LanguageSection";

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados Globales
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          profileRes,
          projectsRes,
          experienceRes,
          educationRes,
          skillsRes,
          languagesRes,
        ] = await Promise.all([
          fetch(`${API_URL}/profile`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/experience`),
          fetch(`${API_URL}/education`),
          fetch(`${API_URL}/skills`),
          fetch(`${API_URL}/languages`),
        ]);

        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();
        const experienceData = await experienceRes.json();
        const educationData = await educationRes.json();
        const skillsData = await skillsRes.json();
        const languagesData = await languagesRes.json();

        setProfile(profileData);
        setProjects(projectsData);
        setExperiences(experienceData);
        setEducations(educationData);
        setSkills(skillsData);
        setLanguages(languagesData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        showNotification("Error cargando datos", "error");
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando panel...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 relative">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Career Hub Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            {profile?.email}
          </span>
          <Link
            to="/cv-preview"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition transform hover:scale-105"
          >
            <FaFilePdf />
            Generar CV
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 border border-red-100 px-3 py-1 rounded hover:bg-red-50 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <ProfileSection
          profile={profile}
          setProfile={setProfile}
          showNotification={showNotification}
        />

        <ProjectsSection
          projects={projects}
          setProjects={setProjects}
          showNotification={showNotification}
        />

        <SkillsSection
          skills={skills}
          setSkills={setSkills}
          showNotification={showNotification}
        />

        <LanguageSection
          languages={languages}
          setLanguages={setLanguages}
          showNotification={showNotification}
        />

        <ExperienceSection
          experiences={experiences}
          setExperiences={setExperiences}
          showNotification={showNotification}
        />

        <EducationSection
          educations={educations}
          setEducations={setEducations}
          showNotification={showNotification}
        />
      </div>

      {notification && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in z-50 flex items-center gap-2 ${
            notification.type === "error" ? "bg-red-500" : "bg-gray-900"
          }`}
        >
          <span>{notification.type === "error" ? "❌" : "✅"}</span>
          {notification.message}
        </div>
      )}
    </div>
  );
}
