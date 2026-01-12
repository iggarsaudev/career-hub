import { useState, useEffect } from "react";

export default function Navbar({ profile }) {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Definimos los enlaces en un array para no repetir código
  const navLinks = [
    { id: "about", label: "Sobre mí" },
    { id: "experience", label: "Experiencia" },
    { id: "education", label: "Formación" },
    { id: "projects", label: "Proyectos" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "experience", "education", "projects"];
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
      setIsMobileMenuOpen(false); // <--- 2. Cerramos menú al hacer click
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center relative">
        {/* Logo */}
        {/* <div
          onClick={() => scrollToSection("home")}
          className="font-bold text-xl cursor-pointer text-gray-800 hover:text-blue-600 transition tracking-tight z-50"
        >
          {profile?.name ? profile.name.split(" ")[0] : "Portfolio"}
        </div> */}

        {/* Menú (Desktop) */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((item) => (
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

        {/* Botón Admin (Desktop) */}
        <a
          href="/login"
          className="hidden md:block text-xs px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition font-bold"
        >
          Admin
        </a>

        {/* Botón hamburguesa (Móvil) */}
        <button
          className="md:hidden p-2 text-gray-600 focus:outline-none z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            // Icono X (Cerrar)
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Icono Hamburguesa (Abrir)
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
          )}
        </button>

        {/* Menú móvil */}
        <div
          className={`absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col p-6 gap-4 text-center">
            {navLinks.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-lg font-medium w-full py-2 ${
                    activeSection === item.id
                      ? "text-blue-600 bg-blue-50 rounded-lg"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className="pt-4 border-t border-gray-100 mt-2">
              <a
                href="/login"
                className="inline-block text-sm px-6 py-3 bg-gray-900 text-white rounded-full font-bold w-full"
              >
                Admin Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
