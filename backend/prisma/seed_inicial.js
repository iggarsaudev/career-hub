const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando sembrado de datos (Seeding)...");

  // Limpiar base de datos
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profile.deleteMany();

  console.log("🗑️  Base de datos limpiada.");

  // --------------------------------------------------------
  // CREAR PERFIL (PROFILE)
  // --------------------------------------------------------
  const profile = await prisma.profile.create({
    data: {
      name: "Ignacio García",
      email: "iggarsau@hotmail.com",
      avatar: "https://github.com/shadcn.png", // Imagen de ejemplo

      // --- ESPAÑOL ---
      title: "Desarrollador Full Stack",
      summary: "Especialista en desarrollo web moderno.",
      bio: "Soy un desarrollador apasionado por crear aplicaciones web escalables y de alto rendimiento usando el stack MERN.",

      // --- INGLÉS ---
      title_en: "Full Stack Developer",
      summary_en: "Specialist in modern web development.",
      bio_en:
        "I am a developer passionate about building scalable and high-performance web applications using the MERN stack.",
    },
  });

  console.log(`👤 Perfil creado: ${profile.name}`);

  // --------------------------------------------------------
  // CREAR PROYECTOS (PROJECTS)
  // --------------------------------------------------------

  // Proyecto 1
  await prisma.project.create({
    data: {
      slug: "career-hub-cms",
      techStack: ["React", "Node.js", "Prisma", "PostgreSQL", "Tailwind"],
      repoUrl: "https://github.com/iggarsaudev/career-hub",
      demoUrl: "https://career-hub.vercel.app",
      image:
        "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000",
      isVisible: true,

      // --- ESPAÑOL ---
      title: "Career Hub CMS",
      description:
        "Un portafolio profesional con panel de administración y soporte multi-idioma.",

      // --- INGLÉS ---
      title_en: "Career Hub CMS",
      description_en:
        "A professional portfolio with admin dashboard and multi-language support.",
    },
  });

  // Proyecto 2
  await prisma.project.create({
    data: {
      slug: "ecommerce-dashboard",
      techStack: ["Next.js", "Stripe", "MongoDB"],
      repoUrl: "https://github.com/tu-usuario/ecommerce",
      demoUrl: null,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
      isVisible: true,

      // --- ESPAÑOL ---
      title: "Dashboard E-commerce",
      description:
        "Plataforma de análisis de ventas en tiempo real para tiendas online.",

      // --- INGLÉS ---
      title_en: "E-commerce Dashboard",
      description_en: "Real-time sales analysis platform for online stores.",
    },
  });

  console.log(`🚀 Proyectos creados.`);

  // --------------------------------------------------------
  // CREAR EXPERIENCIA (EXPERIENCE)
  // --------------------------------------------------------

  // Experiencia Actual
  await prisma.experience.create({
    data: {
      company: "Tech Solutions Inc.",
      startDate: new Date("2023-01-15"),
      endDate: null, // Trabajo actual
      isVisible: true,

      // --- ESPAÑOL ---
      position: "Senior Frontend Developer",
      description:
        "Liderazgo del equipo de frontend y migración a arquitectura de micro-frontends.",

      // --- INGLÉS ---
      position_en: "Senior Frontend Developer",
      description_en:
        "Leading the frontend team and migrating to micro-frontend architecture.",
    },
  });

  // Experiencia Pasada
  await prisma.experience.create({
    data: {
      company: "Digital Agency",
      startDate: new Date("2020-06-01"),
      endDate: new Date("2022-12-31"),
      isVisible: true,

      // --- ESPAÑOL ---
      position: "Full Stack Developer",
      description: "Desarrollo de sitios corporativos y tiendas online.",

      // --- INGLÉS ---
      position_en: "Full Stack Developer",
      description_en: "Development of corporate sites and online stores.",
    },
  });

  console.log(`💼 Experiencias creadas.`);

  // --------------------------------------------------------
  // CREAR EDUCACIÓN (EDUCATION)
  // --------------------------------------------------------
  await prisma.education.create({
    data: {
      school: "Universidad Politécnica",
      startDate: new Date("2016-09-01"),
      endDate: new Date("2020-06-30"),
      isVisible: true,

      // --- ESPAÑOL ---
      degree: "Grado en Ingeniería Informática",
      description: "Especialidad en Ingeniería del Software.",

      // --- INGLÉS ---
      degree_en: "Bachelor's Degree in Computer Science",
      degree: "Grado en Ingeniería Informática", // Aseguramos que el campo base también se llena si es required
      description_en: "Major in Software Engineering.",
    },
  });

  console.log(`🎓 Educación creada.`);
  console.log("✅ Seeding finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
