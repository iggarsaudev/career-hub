import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ profile }) {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Enlaces reordenados
  const navLinks = [
    { id: "about", label: t("nav.about") || "Sobre mí" },
    { id: "projects", label: t("nav.projects") || "Proyectos" },
    { id: "skills", label: language === "en" ? "Skills" : "Habilidades" },
    {
      id: "experience",
      label: language === "en" ? "Experience" : "Experiencia",
    },
    { id: "education", label: language === "en" ? "Education" : "Formación" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "projects",
        "skills",
        "experience",
        "education",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight > scrollPosition
        ) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center relative">
        {/* Logo */}
        <div
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3 font-bold text-xl cursor-pointer text-gray-800 dark:text-white hover:text-blue-600 transition tracking-tight z-50"
        >
          <img
            src="/mi-logo.png"
            alt="Logo"
            className="h-28 w-28 object-contain rounded-full"
          />
        </div>

        {/* Menú Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {navLinks.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 transition relative py-1 ${
                    activeSection === item.id
                      ? "text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fade-in"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
            {/* Botón tema oscuro/claro */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xl"
              title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* Botón bandera */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
              title={
                language === "es" ? "Cambiar a Inglés" : "Switch to Spanish"
              }
            >
              <img
                src={language === "es" ? "/es.png" : "/en.png"}
                alt="Idioma"
                className="w-6 h-6 object-contain"
              />
            </button>

            {/* Botón Admin */}
            <a
              href="/login"
              title="Acceso Admin"
              className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </a>

            {/* Botón Contactar */}
            <a
              href={`mailto:${profile?.email}`}
              className="text-xs px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition font-bold shadow-md transform hover:-translate-y-0.5"
            >
              {language === "en" ? "Contact" : "Contactar"}
            </a>
          </div>
        </div>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 focus:outline-none z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Menú móvil */}
        <div
          className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col p-6 gap-4 text-center">
            {navLinks.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-lg font-medium w-full py-2 ${
                    activeSection === item.id
                      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 rounded-lg"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* Opciones Móvil (Tema + Idioma) */}
            <li className="flex justify-center gap-4 py-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={toggleTheme}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-xl"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                <img
                  src={language === "es" ? "/es.png" : "/en.png"}
                  alt="Lang"
                  className="w-8 h-8 object-contain"
                />
              </button>
            </li>

            <li className="flex flex-col gap-3">
              <a
                href={`mailto:${profile?.email}`}
                className="inline-block text-sm px-6 py-3 bg-blue-600 text-white rounded-xl font-bold w-full"
              >
                {language === "en" ? "Contact Now" : "Contactar Ahora"}
              </a>
              <a href="/login" className="text-sm text-gray-400">
                Admin Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
