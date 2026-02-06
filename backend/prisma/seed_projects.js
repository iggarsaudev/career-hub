const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Función auxiliar para crear slugs
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

async function main() {
  console.log("🌱 Iniciando Seed Completo...");

  // --------------------------------------------------------
  // LIMPIEZA
  // --------------------------------------------------------
  console.log("🗑️ Limpiando base de datos...");
  // Borramos proyectos y skills para empezar de cero y evitar duplicados
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});

  // --------------------------------------------------------
  // SEED DE PROYECTOS
  // --------------------------------------------------------
  console.log("🚀 Insertando Proyectos...");

  const projectsData = [
    {
      title: "Career Hub",
      title_en: "Career Hub - Portfolio & Admin Panel",
      description:
        "Plataforma integral de portafolio con panel de administración protegido. Permite la gestión dinámica de proyectos, habilidades y experiencia laboral, con soporte multi-idioma y autenticación segura.",
      description_en:
        "Comprehensive portfolio platform with a protected admin dashboard. Allows dynamic management of projects, skills, and work experience, featuring multi-language support and secure authentication.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", // Dashboard vibe
      repoUrl: "https://github.com/iggarsaudev/career-hub", // He puesto tu usuario, asumo que estará ahí
      techStack: ["React", "Node.js", "Prisma", "PostgreSQL", "TailwindCSS"], // CAMBIADO: tech -> techStack
      isVisible: true,
    },
    {
      title: "TFM IgLusShop",
      title_en: "IgLusShop - Master's Final Project",
      description:
        "Proyecto de Fin de Máster desarrollado de forma colaborativa. Plataforma web completa que integra lógica de backend sólida con interfaz dinámica, gestionando un ciclo full-stack complejo.",
      description_en:
        "Collaborative Master's Final Project. A comprehensive web platform integrating solid backend logic with a dynamic interface, demonstrating the ability to manage a complex full-stack development cycle.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/TFM_IgLusShop", // CAMBIADO: link -> repoUrl
      techStack: ["PHP", "TypeScript", "CSS", "HTML", "MySQL"], // CAMBIADO: tech -> techStack
      isVisible: true,
    },
    {
      title: "Landing Page Beypei",
      title_en: "Beypei Landing Page",
      description:
        "Página promocional diseñada mobile-first. Estructurada con HTML5 y el sistema de rejilla de Bootstrap para garantizar adaptabilidad perfecta y experiencia fluida.",
      description_en:
        "Promotional landing page designed with a mobile-first approach. Structured with HTML5 and Bootstrap grid system to ensure perfect adaptability and a fluid user experience.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/landing_page_beypei",
      techStack: ["HTML5", "CSS3", "Bootstrap", "JavaScript", "Responsive"],
      isVisible: true,
    },
    {
      title: "Buscador de Bebidas",
      title_en: "Drink Recipe Finder",
      description:
        "App interactiva para consultar recetas conectándose a una API externa. Destaca por validaciones estrictas (Zod) y gestor de estado ligero (Zustand).",
      description_en:
        "Interactive app to query drink recipes via external API. Features strict data validation (Zod) and lightweight state management (Zustand) for instant results.",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/bebidas-react-typescript",
      techStack: ["React", "TypeScript", "Zustand", "Zod", "Tailwind CSS"],
      isVisible: true,
    },
    {
      title: "Cotizador de Criptomonedas",
      title_en: "Crypto Quote App",
      description:
        "Herramienta financiera para consultar valor de criptos en tiempo real. Énfasis en seguridad de tipos e integridad de datos de la API.",
      description_en:
        "Financial tool to check real-time cryptocurrency values. Emphasizes type safety and API data integrity, offering a clean and reliable interface.",
      image:
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/cripto-react-typescript",
      techStack: ["React", "TypeScript", "Zod", "Zustand", "API"],
      isVisible: true,
    },
    {
      title: "Buscador de Clima",
      title_en: "Weather Dashboard",
      description:
        "Dashboard meteorológico para consultar el clima. Arquitectura modular separando lógica de presentación del consumo de datos externos.",
      description_en:
        "Weather dashboard to check climate conditions. Features a modular architecture separating UI logic from external data consumption.",
      image:
        "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/clima-react-typescript",
      techStack: ["React", "TypeScript", "CSS Modules", "API Integration"],
      isVisible: true,
    },
    {
      title: "Gestor de Pacientes",
      title_en: "Vet Patient Manager",
      description:
        "Sistema para sector veterinario. Manejo avanzado de formularios y validaciones para seguimiento y gestión de citas.",
      description_en:
        "Veterinary sector admin system. Advanced form handling and validations for appointment tracking and patient management.",
      image:
        "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/pacientes-zustand",
      techStack: ["React", "TypeScript", "Hook Form", "Zustand", "Tailwind"],
      isVisible: true,
    },
    {
      title: "Calorie Tracker",
      title_en: "Calorie Tracker",
      description:
        "App de seguimiento nutricional para controlar ingesta y ejercicio. Dominio de gestión de estado nativa sin dependencias.",
      description_en:
        "Nutritional tracking app for caloric intake and exercise. Demonstrates mastery of native React state management without dependencies.",
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/calorie-tracker-contextapi",
      techStack: ["React", "TypeScript", "Context API", "UseReducer"],
      isVisible: true,
    },
    {
      title: "Control de Gastos",
      title_en: "Expense Tracker",
      description:
        "Planificador financiero para visualizar presupuesto. Patrones avanzados de estado para lógica de negocio y balance dinámico.",
      description_en:
        "Financial planner to visualize budget. Implements advanced state patterns for business logic and dynamic balance updates.",
      image:
        "https://images.unsplash.com/photo-1554224155-9844c633185f?auto=format&fit=crop&q=80&w=800",
      repoUrl: "https://github.com/iggarsaudev/control-gastos-contextapi",
      techStack: ["React", "TypeScript", "Context API", "CSS"],
      isVisible: true,
    },
  ];

  const reversedProjects = [...projectsData].reverse();

  for (const project of reversedProjects) {
    await prisma.project.create({
      data: {
        ...project,
        slug: createSlug(project.title),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
