const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 'image' es el nombre del campo que debe enviar el frontend en el FormData
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
