const prisma = require("../config/db");

const getSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { id: "asc" } });
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener skills" });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, category, isVisible } = req.body;
    const newSkill = await prisma.skill.create({
      data: { name, category, isVisible },
    });
    res.json(newSkill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear skill" });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, isVisible } = req.body;
    const updated = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: { name, category, isVisible },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar skill" });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Skill eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar skill" });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
