const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando carga de Skills Profesionales...");

  // Limpiamos SOLO la tabla de skills
  await prisma.skill.deleteMany({});

  const skillsData = [
    // LENGUAJES
    { name: "JavaScript", category: "Lenguajes", category_en: "Languages" },
    { name: "TypeScript", category: "Lenguajes", category_en: "Languages" },
    { name: "Java", category: "Lenguajes", category_en: "Languages" },
    { name: "PHP", category: "Lenguajes", category_en: "Languages" },

    // FRONTEND
    { name: "HTML", category: "Frontend", category_en: "Frontend" },
    { name: "CSS", category: "Frontend", category_en: "Frontend" },
    { name: "React.js", category: "Frontend", category_en: "Frontend" },
    { name: "Vite", category: "Frontend", category_en: "Frontend" },
    { name: "TailwindCSS", category: "Frontend", category_en: "Frontend" },
    { name: "SASS", category: "Frontend", category_en: "Frontend" },
    { name: "jQuery", category: "Frontend", category_en: "Frontend" },
    { name: "Android", category: "Frontend", category_en: "Frontend" },

    // BACKEND
    { name: "Node.js", category: "Backend", category_en: "Backend" },
    { name: "Express", category: "Backend", category_en: "Backend" },

    // BASE DE DATOS
    { name: "SQL", category: "Base de Datos", category_en: "Database" },
    { name: "MySQL", category: "Base de Datos", category_en: "Database" },
    { name: "MongoDB", category: "Base de Datos", category_en: "Database" },
    { name: "PL/SQL", category: "Base de Datos", category_en: "Database" },

    // DEVOPS
    { name: "Docker", category: "DevOps", category_en: "DevOps" },

    // HERRAMIENTAS
    {
      name: "Git",
      category: "Control de Versiones",
      category_en: "Version Control",
    },
    {
      name: "GitHub",
      category: "Control de Versiones",
      category_en: "Version Control",
    },
    { name: "WordPress", category: "CMS", category_en: "CMS" },
    { name: "Adobe Photoshop", category: "Diseño", category_en: "Design" },
    { name: "Figma", category: "Diseño", category_en: "Design" },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        category: skill.category,
        category_en: skill.category_en,
        isVisible: true,
      },
    });
  }
  console.log("✅ Skills cargadas correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
