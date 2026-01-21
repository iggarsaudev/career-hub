import { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Intentamos leer del localStorage, si no, defecto 'es'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_lang") || "es";
  });

  const toggleLanguage = () => {
    const newLang = language === "es" ? "en" : "es";
    setLanguage(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  // Helper para traducir textos simples de UI (botones, nav)
  const t = (key) => {
    const translations = {
      es: {
        "nav.projects": "Proyectos",
        "nav.about": "Sobre mí",
        "btn.view": "Ver Proyecto",
      },
      en: {
        "nav.projects": "Projects",
        "nav.about": "About me",
        "btn.view": "View Project",
      },
    };
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
