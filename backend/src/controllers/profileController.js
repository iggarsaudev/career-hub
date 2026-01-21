const prisma = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, title, title_en, summary, summary_en, bio, bio_en } =
      req.body;

    // Asumimos que siempre editamos el ID 1 (Single User CMS)
    const updatedProfile = await prisma.profile.update({
      where: { id: 1 },
      data: { name, title, title_en, summary, summary_en, bio, bio_en },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "No se pudo actualizar el perfil" });
  }
};

module.exports = { getProfile, updateProfile };
