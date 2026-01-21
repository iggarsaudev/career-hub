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
    const {
      position,
      position_en,
      company,
      startDate,
      endDate,
      description,
      description_en,
      isVisible,
    } = req.body;

    const newExperience = await prisma.experience.create({
      data: {
        position,
        position_en,
        company,
        startDate: new Date(startDate), // Convertimos string a Date
        endDate: endDate ? new Date(endDate) : null,
        description,
        description_en,
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });
    res.json(newExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear experiencia" });
  }
};

// Actualizar
const updateExperience = async (req, res) => {
  const { id } = req.params;
  const {
    position,
    position_en,
    company,
    startDate,
    endDate,
    description,
    description_en,
    isVisible,
  } = req.body;

  try {
    const updatedExperience = await prisma.experience.update({
      where: { id: parseInt(id) },
      data: {
        position,
        position_en,
        company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        description_en,
        isVisible,
      },
    });
    res.json(updatedExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar experiencia" });
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

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
