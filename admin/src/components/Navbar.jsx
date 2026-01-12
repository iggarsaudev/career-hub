import { useState, useEffect } from "react";

export default function Navbar({ profile }) {
  const [activeSection, setActiveSection] = useState("home");

  // Lógica del "Scroll Spy" (Detectar sección activa)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "projects"];
      const scrollPosition = window.scrollY + 100; // Offset para que detecte antes de llegar

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

  // Función de scroll suave
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo / Nombre */}
        <div
          onClick={() => scrollToSection("home")}
          className="font-bold text-xl cursor-pointer text-gray-800 hover:text-blue-600 transition tracking-tight"
        >
          {profile?.name ? profile.name.split(" ")[0] : "Portfolio"}.
        </div>

        {/* Enlaces Desktop */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          {[
            { id: "about", label: "Sobre mí" },
            { id: "experience", label: "Experiencia" },
            { id: "education", label: "Formación" },
            { id: "projects", label: "Proyectos" },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`hover:text-blue-600 transition relative py-1 ${
                  activeSection === item.id ? "text-blue-600" : ""
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-fade-in"></span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Botón Admin */}
        <a
          href="/login"
          className="text-xs px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition font-bold"
        >
          Admin
        </a>
      </div>
    </nav>
  );
}
