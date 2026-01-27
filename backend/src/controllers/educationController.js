const prisma = require("../config/db");

// Obtener todos
const getEducation = async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: "desc" },
    });
    res.json(education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener formación" });
  }
};

// Crear
const createEducation = async (req, res) => {
  try {
    const {
      degree,
      degree_en,
      school,
      startDate,
      endDate,
      description,
      description_en,
      isVisible,
      isVisibleInPdf,
      showDescriptionInPdf,
    } = req.body;
    const newEdu = await prisma.education.create({
      data: {
        degree,
        degree_en,
        school,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: description || "",
        description_en: description_en || "",
        isVisible: isVisible !== undefined ? isVisible : true,
        isVisibleInPdf: isVisibleInPdf !== undefined ? isVisibleInPdf : true,
        showDescriptionInPdf:
          showDescriptionInPdf !== undefined ? showDescriptionInPdf : true,
      },
    });
    res.json(newEdu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear formación" });
  }
};

// Actualizar
const updateEducation = async (req, res) => {
  const { id } = req.params;
  const {
    degree,
    degree_en,
    school,
    startDate,
    endDate,
    description,
    description_en,
    isVisible,
    isVisibleInPdf,
    showDescriptionInPdf,
  } = req.body;
  try {
    const updatedEdu = await prisma.education.update({
      where: { id: parseInt(id) },
      data: {
        degree,
        degree_en,
        school,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        description_en,
        isVisible,
        isVisibleInPdf,
        showDescriptionInPdf,
      },
    });
    res.json(updatedEdu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar formación" });
  }
};

// Borrar
const deleteEducation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.education.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Formación eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar formación" });
  }
};

module.exports = {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
