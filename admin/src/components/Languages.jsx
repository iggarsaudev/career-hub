import React from "react";

export default function Languages({ languages }) {
  if (!languages || languages.length === 0) return null;

  return (
    <section id="languages" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Idiomas</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="bg-white border border-gray-200 rounded-xl px-8 py-6 shadow-sm flex flex-col items-center min-w-[200px] hover:border-pink-200 hover:bg-pink-50 transition-colors duration-300"
            >
              <span className="text-4xl mb-3">🗣️</span>
              <h3 className="text-xl font-bold text-gray-800">{lang.name}</h3>
              <span className="text-pink-600 font-bold bg-pink-100 px-3 py-1 rounded-full text-sm mt-2">
                {lang.level}
              </span>
              {/* Opcional: mostrar versión inglés en pequeño */}
              {lang.level_en && (
                <p className="text-xs text-gray-400 mt-2">({lang.level_en})</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
