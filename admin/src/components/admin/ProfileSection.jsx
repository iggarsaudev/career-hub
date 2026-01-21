import { useState } from "react";
import { API_URL } from "../../config";

export default function ProfileSection({
  profile,
  setProfile,
  showNotification,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("es");
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        showNotification("Perfil actualizado correctamente", "success");
      } else {
        showNotification("Error al guardar", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification("Error de conexión", "error");
    }
  };

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative mb-8">
      {/* Header Visual */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-32 w-full"></div>

      <div className="px-8 pb-8">
        <div className="-mt-12 mb-6 flex justify-between items-end">
          <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase overflow-hidden">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              profile.name?.charAt(0) || "A"
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="animate-fade-in bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                ✏️ Editando Perfil
              </h3>

              {/* Selector de idioma */}
              <div className="flex bg-gray-200 rounded-lg p-1 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("es")}
                  className={`px-4 py-1.5 rounded-md transition-all ${activeTab === "es" ? "bg-white text-gray-800 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Español
                </button>
                <button
                  onClick={() => setActiveTab("en")}
                  className={`px-4 py-1.5 rounded-md transition-all ${activeTab === "en" ? "bg-white text-gray-800 shadow-sm font-bold" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Inglés
                </button>
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Nombre
                </label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {activeTab === "es" ? (
                // Español
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Título (ES)
                    </label>
                    <input
                      name="title"
                      value={form.title || ""}
                      onChange={handleChange}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Resumen (ES)
                    </label>
                    <textarea
                      name="summary"
                      value={form.summary || ""}
                      onChange={handleChange}
                      rows="2"
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Biografía (ES)
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio || ""}
                      onChange={handleChange}
                      rows="4"
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                // Inglés
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Título (EN)
                    </label>
                    <input
                      name="title_en"
                      value={form.title_en || ""}
                      onChange={handleChange}
                      placeholder="Full Stack Developer"
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Resumen (EN)
                    </label>
                    <textarea
                      name="summary_en"
                      value={form.summary_en || ""}
                      onChange={handleChange}
                      rows="2"
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Biografía (EN)
                    </label>
                    <textarea
                      name="bio_en"
                      value={form.bio_en || ""}
                      onChange={handleChange}
                      rows="4"
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6 mt-2 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          /* Modo lectura */
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {profile.name}
                </h2>
                <div className="mt-1 flex flex-col gap-1">
                  <p className="text-blue-600 font-medium text-lg flex items-center gap-2">
                    {profile.title}
                  </p>
                  {profile.title_en && (
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-xs border border-gray-200 rounded px-1">
                        EN
                      </span>
                      {profile.title_en}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setForm({ ...profile });
                  setIsEditing(true);
                  setActiveTab("es");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition border border-gray-200"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Editar Perfil
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Resumen
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.summary}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Biografía
                </h3>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                  {profile.bio}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
