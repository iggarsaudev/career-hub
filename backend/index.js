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

// RUTAS DE USUERIO
// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // leemos las credenciales del archivo .env
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  // validamos
  if (email === validEmail && password === validPassword) {
    // login correcto
    // en un futuro aquí generaremos un jwt real
    // por ahora devolvemos un token simulado
    return res.json({
      success: true,
      token: "token_secreto_backend_12345",
      user: { name: "Admin", email: validEmail },
    });
  }

  // login incorrecto
  return res.status(401).json({
    success: false,
    error: "credenciales inválidas",
  });
});

// Perfil
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

// Actualizar perfil
app.put("/api/profile", async (req, res) => {
  try {
    const { name, title, summary, bio } = req.body;

    // actualizamos el registro con ID 1
    const updatedProfile = await prisma.profile.update({
      where: { id: 1 },
      data: {
        name,
        title,
        summary,
        bio,
      },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("error al actualizar perfil:", error);
    res.status(500).json({ error: "no se pudo actualizar el perfil" });
  }
});

// RUTAS DE PROYECTOS
// Obtener todos los proyectos
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        id: "desc", // Mostramos primero los más nuevos
      },
    });
    res.json(projects);
  } catch (error) {
    console.error("error al obtener proyectos:", error);
    res.status(500).json({ error: "error al obtener proyectos" });
  }
});

// Crear un nuevo proyecto
app.post("/api/projects", async (req, res) => {
  try {
    // Recibimos 'technologies' (Array de strings)
    const { title, description, image, link, technologies } = req.body;

    // Generamos el slug automáticamente
    // Convertimos "Mi Proyecto" -> "mi-proyecto"
    // Añadimos Date.now() para asegurar que sea único siempre
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
        repoUrl: link,
        techStack: technologies || [], // Guardamos el array. Si no viene nada, guardamos array vacío []
        isVisible: true,
      },
    });

    res.json(newProject);
  } catch (error) {
    console.error("error al crear proyecto:", error);
    res.status(500).json({ error: "no se pudo crear el proyecto" });
  }
});

// ruta base para probar que el servidor vive
app.get("/", (req, res) => {
  res.send("api career hub funcionando");
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});
