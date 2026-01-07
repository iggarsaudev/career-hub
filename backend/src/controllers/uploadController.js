const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = (req, res) => {
  // Verificamos si multer nos pasó un archivo
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No se ha proporcionado ningún archivo" });
  }

  // Creamos una promesa para manejar la subida asíncrona por stream
  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "career-hub-projects", // Carpeta en tu Cloudinary
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      // Convertimos el buffer del archivo en un stream legible
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  // Ejecutamos la subida
  const processUpload = async () => {
    try {
      const result = await streamUpload(req.file.buffer);
      // Devolvemos la URL segura
      res.json({ url: result.secure_url });
    } catch (error) {
      console.error("Error al subir imagen:", error);
      res.status(500).json({ error: "Error al subir la imagen a Cloudinary" });
    }
  };

  processUpload();
};

module.exports = { uploadImage };
