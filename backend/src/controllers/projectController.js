const prisma = require("../config/db");

// Obtener todos
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

// Crear
const createProject = async (req, res) => {
  try {
    const {
      title,
      title_en,
      description,
      description_en,
      image,
      link,
      technologies,
    } = req.body;

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
        title_en,
        description,
        description_en,
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

// Actualizar
const updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    title_en,
    description,
    description_en,
    image,
    link,
    technologies,
    isVisible,
  } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) }, // Importante: convertir ID a entero
      data: {
        title,
        title_en,
        description,
        description_en,
        image,
        repoUrl: link, // Mapeamos link (frontend) a repoUrl (db)
        techStack: technologies, // Prisma actualizará el array completo
        isVisible,
      },
    });
    res.json(updatedProject);
  } catch (error) {
    console.error("Error actualizando proyecto:", error);
    // Prisma lanza error si no encuentra el ID
    res
      .status(500)
      .json({ error: "No se pudo actualizar (posible ID inválido)" });
  }
};

// Eliminar
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando proyecto:", error);
    res.status(500).json({ error: "No se pudo eliminar el proyecto" });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
