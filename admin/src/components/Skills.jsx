import React from "react";
import { getSkillIcon } from "../utils/skillIcons";
import { useLanguage } from "../context/LanguageContext";

export default function Skills({ skills, languages }) {
  const { language } = useLanguage();

  // Agrupamos las skills
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Otras";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section
      id="skills"
      className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          {language === "en" ? "Technical Skills" : "Habilidades Técnicas"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Skills Técnicas */}
          {Object.entries(groupedSkills).map(([categoryKey, items]) => {
            // Obtenemos el nombre en inglés del primer elemento del grupo
            // Si estamos en modo 'en' y existe category_en, lo usamos. Si no, usamos la clave normal.
            const displayCategory =
              language === "en" && items[0]?.category_en
                ? items[0].category_en
                : categoryKey;

            return (
              <div
                key={categoryKey}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
                  {displayCategory}
                </h3>
                <div className="grid grid-cols-3 gap-6 justify-items-center">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
                        {getSkillIcon(skill.name)}
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
                        {skill.name}{" "}
                        {/* El nombre de la tecno (React, Git) suele ser universal */}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Tarjeta de idiomas */}
          {languages && languages.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
                {language === "en" ? "Languages" : "Idiomas"}
              </h3>
              <div className="flex flex-col gap-4">
                {languages.map((lang) => {
                  // Lógica de traducción para el nombre del idioma y el nivel
                  const displayName =
                    language === "en" && lang.name_en
                      ? lang.name_en
                      : lang.name;
                  const displayLevel =
                    language === "en" && lang.level_en
                      ? lang.level_en
                      : lang.level;

                  return (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                            {displayName}
                          </p>
                          {/* Mostramos el nivel traducido */}
                          {displayLevel && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {displayLevel}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
