const prisma = require("../config/db");

const getLanguages = async (req, res) => {
  try {
    const langs = await prisma.language.findMany({ orderBy: { id: "asc" } });
    res.json(langs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener idiomas" });
  }
};

const createLanguage = async (req, res) => {
  try {
    const { name, name_en, level, level_en, isVisible } = req.body;
    const newLang = await prisma.language.create({
      data: { name, name_en, level, level_en, isVisible },
    });
    res.json(newLang);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear idioma" });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, name_en, level, level_en, isVisible } = req.body;
    const updated = await prisma.language.update({
      where: { id: parseInt(id) },
      data: { name, name_en, level, level_en, isVisible },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar idioma" });
  }
};

const deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.language.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Idioma eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar idioma" });
  }
};

module.exports = {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
