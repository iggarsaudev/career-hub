const prisma = require("../config/db");

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, image, link, technologies } = req.body;

    // Generación de Slug
    const slug =
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") +
      "-" +
      Date.now();

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        image,
        slug,
        repoUrl: link, // Mapeo importante: frontend 'link' -> backend 'repoUrl'
        techStack: technologies || [],
        isVisible: true,
      },
    });

    res.json(newProject);
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ error: "No se pudo crear el proyecto" });
  }
};

module.exports = { getProjects, createProject };
