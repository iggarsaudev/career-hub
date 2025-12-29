import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // cargamos datos al entrar
  useEffect(() => {
    fetch("http://localhost:4000/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("error al cargar perfil:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        cargando datos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* barra superior */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Career Hub Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {profile?.email || "usuario"}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-100 px-3 py-1 rounded hover:bg-red-50 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* contenido principal */}
      <div className="max-w-4xl mx-auto px-6">
        {/* tarjeta de perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 h-32 w-full"></div>{" "}
          {/* fondo decorativo */}
          <div className="px-8 pb-8">
            <div className="-mt-12 mb-6">
              {/* avatar placeholder (círculo blanco) */}
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                {profile?.name ? profile.name.charAt(0) : "A"}
              </div>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.name || "Nombre no disponible"}
                </h2>
                <p className="text-blue-600 font-medium">
                  {profile?.title || "Sin título profesional"}
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                Editar Perfil
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Resumen
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {profile?.summary || "Sin resumen"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Biografía
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile?.bio || "Sin biografía"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
