const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Definición de Rutas Base
app.use("/api/auth", authRoutes); // Rutas empiezan con /api/auth
app.use("/api/profile", profileRoutes); // Rutas empiezan con /api/profile
app.use("/api/projects", projectRoutes); // Rutas empiezan con /api/projects

// Ruta Health Check
app.get("/", (req, res) => {
  res.send("API Career Hub v1.0 funcionando 🚀");
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
