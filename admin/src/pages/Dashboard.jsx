import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // ¿Estamos editando?
  const [formData, setFormData] = useState({}); // Datos temporales del formulario

  // Cargar datos iniciales
  useEffect(() => {
    fetch(`${API_URL}/profile`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData(data); // Inicializamos el formulario con los datos actuales
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

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios en el Backend
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData); // Actualizamos la vista oficial
        setIsEditing(false); // Salimos del modo edición
        alert("¡Perfil actualizado con éxito!");
      } else {
        alert("Error al guardar los cambios");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  // Cancelar edición (volvemos a los datos originales)
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) return <div className="p-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Career Hub Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded border border-red-100 transition"
        >
          Salir
        </button>
      </nav>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Fondo azul header */}
          <div className="bg-blue-600 h-32 w-full"></div>

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="-mt-12 mb-6">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                {profile?.name ? profile.name.charAt(0) : "A"}
              </div>
            </div>

            {/* Formulario de edición */}
            {isEditing ? (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título Profesional
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resumen (Corto)
                  </label>
                  <textarea
                    name="summary"
                    rows="2"
                    value={formData.summary || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía (Detallada)
                  </label>
                  <textarea
                    name="bio"
                    rows="6"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo vista */
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
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Editar Perfil
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Resumen
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {profile?.summary}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
      </div>
    </div>
  );
}
