const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // creamos un perfil inicial si no existe
  const profile = await prisma.profile.upsert({
    where: { email: "iggarsau@hotmail.com" },
    update: {},
    create: {
      email: "iggarsau@hotmail.com",
      name: "Ignacio García Sausor",
      title: "Full Stack Developer",
      bio: "Informático Técnico con amplia experiencia en Java, Bases de Datos y React, y más de 8 años desarrollando proyectos tecnológicos para optimizar y digitalizar los procesos diarios de la Administración Pública. He liderado equipos multidisciplinares, coordinado proyectos de integración de sistemas y formado a personal técnico. Busco un nuevo desafío donde aplicar mis conocimientos y habilidades de liderazgo para contribuir al éxito de la organización y seguir desarrollándome profesionalmente.",
      summary: "Dev Full Stack especializado en Java y React.",
    },
  });

  console.log("perfil creado o encontrado:", profile);

  // creamos un proyecto de prueba
  const project = await prisma.project.create({
    data: {
      title: "Career Hub",
      slug: "career-hub",
      description: "CMS personal para gestionar portfolio y CV.",
      isVisible: true,
      techStack: ["node", "react", "postgres"],
    },
  });

  console.log("proyecto de prueba creado:", project);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
