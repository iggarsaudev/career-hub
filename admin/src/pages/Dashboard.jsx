import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

import ProfileSection from "../components/admin/ProfileSection";
import ProjectsSection from "../components/admin/ProjectsSection";
import ExperienceSection from "../components/admin/ExperienceSection";

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados Globales
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
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
        const [profileRes, projectsRes, experienceRes] = await Promise.all([
          fetch(`${API_URL}/profile`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/experience`),
        ]);

        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();
        const experienceData = await experienceRes.json();

        setProfile(profileData);
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
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 border border-red-100 px-3 py-1 rounded hover:bg-red-50 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Contenido */}
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

        <ExperienceSection
          experiences={experiences}
          setExperiences={setExperiences}
          showNotification={showNotification}
        />
      </div>

      {/* Notificación Global */}
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
