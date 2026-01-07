const prisma = require("../config/db");

// Obtener todas
const getExperiences = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: "desc" }, // Las más recientes primero
    });
    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener experiencia" });
  }
};

// Crear nueva
const createExperience = async (req, res) => {
  try {
    const { position, company, startDate, endDate, description, isVisible } =
      req.body;

    const newExperience = await prisma.experience.create({
      data: {
        position,
        company,
        startDate: new Date(startDate), // Convertimos string a Date
        endDate: endDate ? new Date(endDate) : null,
        description,
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });
    res.json(newExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear experiencia" });
  }
};

// Borrar
const deleteExperience = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.experience.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Experiencia eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar experiencia" });
  }
};

module.exports = { getExperiences, createExperience, deleteExperience };
