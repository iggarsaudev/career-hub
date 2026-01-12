import { useState } from "react";
import { API_URL } from "../../config";

export default function ProfileSection({
  profile,
  setProfile,
  showNotification,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(profile || {});

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
        showNotification("Perfil actualizado", "success");
      } else {
        showNotification("Error al guardar", "error");
      }
    } catch (error) {
      showNotification("Error de conexión", "error");
    }
  };

  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="bg-blue-600 h-32 w-full"></div>
      <div className="px-8 pb-8">
        <div className="-mt-12 mb-6">
          <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
            {profile.name ? profile.name.charAt(0) : "A"}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 animate-fade-in bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-2">Editando Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500">
                  Nombre
                </label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">
                  Título
                </label>
                <input
                  name="title"
                  value={form.title || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">
                Resumen
              </label>
              <textarea
                name="summary"
                value={form.summary || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">
                Biografía
              </label>
              <textarea
                name="bio"
                value={form.bio || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-blue-600 font-medium">{profile.title}</p>
              </div>
              <button
                onClick={() => {
                  setForm(profile); // Reiniciar form al abrir
                  setIsEditing(true);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition border border-gray-200"
              >
                Editar Perfil
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Resumen
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {profile.summary}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Biografía
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
