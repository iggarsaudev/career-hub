const prisma = require("../config/db");

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      title,
      title_en,
      description,
      description_en,
      image,
      techStack,
      repoUrl,
      demoUrl,
      isVisible,
      isVisibleInPdf,
    } = req.body;

    const newProject = await prisma.project.create({
      data: {
        title,
        title_en,
        description,
        description_en,
        image,
        techStack,
        repoUrl,
        demoUrl,
        isVisible: isVisible !== undefined ? isVisible : false,
        isVisibleInPdf: isVisibleInPdf !== undefined ? isVisibleInPdf : true,
      },
    });
    res.json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear proyecto" });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    title_en,
    description,
    description_en,
    image,
    techStack,
    repoUrl,
    demoUrl,
    isVisible,
    isVisibleInPdf,
  } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        title_en,
        description,
        description_en,
        image,
        techStack,
        repoUrl,
        demoUrl,
        isVisible,
        isVisibleInPdf,
      },
    });
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar proyecto" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Proyecto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
