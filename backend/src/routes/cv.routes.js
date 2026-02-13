const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = Router();

// Configuración de guardado
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usamos __dirname directamente (compatible con require)
    const uploadPath = path.join(__dirname, "../../public");

    // Asegurar que existe la carpeta
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Siempre lo llamamos igual para sobreescribir el anterior
    cb(null, "cv_publico.pdf");
  },
});

const upload = multer({ storage: storage });

// Ruta 1, Publicar CV
router.post("/", upload.single("file"), (req, res) => {
  try {
    res.json({ message: "CV publicado correctamente", url: "/cv_publico.pdf" });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar el CV" });
  }
});

// Ruta 2, Descargar CV
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../../public/cv_publico.pdf");
  if (fs.existsSync(filePath)) {
    res.download(filePath, "CV_Ignacio_Garcia_Sausor.pdf");
  } else {
    res.status(404).json({ message: "No hay CV publicado aún" });
  }
});

module.exports = router;
