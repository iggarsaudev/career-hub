const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000; // puerto 4000 para no chocar con react (3000)

// middleware
app.use(cors());
app.use(express.json());

// ruta de prueba
app.get("/", (req, res) => {
  // comprobamos que la api responde
  res.json({ message: "api career hub funcionando ok" });
});

// iniciar servidor
app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});
