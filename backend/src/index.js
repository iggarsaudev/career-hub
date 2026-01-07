const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const experienceRoutes = require("./routes/experienceRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Definición de Rutas Base
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/experience", experienceRoutes);

// Ruta Health Check
app.get("/", (req, res) => {
  res.send("API Career Hub v1.0 funcionando 🚀");
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
