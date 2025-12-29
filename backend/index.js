const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client"); // importante: importar prisma
require("dotenv").config();

const app = express();
const prisma = new PrismaClient(); // instanciar cliente
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// ruta perfil
app.get("/api/profile", async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch (error) {
    // control de errores
    console.error("error al obtener perfil:", error);
    res.status(500).json({ error: "error interno del servidor" });
  }
});

// ruta proyectos
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isVisible: true },
    });
    res.json(projects);
  } catch (error) {
    console.error("error al obtener proyectos:", error);
    res.status(500).json({ error: "error interno del servidor" });
  }
});

// ruta base para probar que el servidor vive
app.get("/", (req, res) => {
  res.send("api career hub funcionando");
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});
