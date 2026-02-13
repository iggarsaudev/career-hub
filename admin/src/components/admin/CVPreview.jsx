import React, { useEffect, useState } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import CVDocument from "../pdf/CVDocument";
import { API_URL } from "../../config";
import QRCode from "qrcode";

export default function CVPreview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, experience, education, skills, languages] =
          await Promise.all([
            fetch(`${API_URL}/profile`).then((res) => res.json()),
            fetch(`${API_URL}/experience`).then((res) => res.json()),
            fetch(`${API_URL}/education`).then((res) => res.json()),
            fetch(`${API_URL}/skills`).then((res) => res.json()),
            fetch(`${API_URL}/languages`).then((res) => res.json()),
          ]);

        // Generar QR
        const urlParaQR =
          profile.portfolioUrl || "https://iggarsaudev-career-hub.vercel.app/";
        const qrDataUrl = await QRCode.toDataURL(urlParaQR, {
          margin: 1,
          color: { dark: "#1B3864" },
        });
        setQrImage(qrDataUrl);

        setData({
          profile,
          experience: experience
            .filter((item) => item.isVisibleInPdf === true)
            .map((item) => ({
              ...item,
              description: item.showDescriptionInPdf ? item.description : "",
            })),
          education: education
            .filter((item) => item.isVisibleInPdf === true)
            .map((item) => ({
              ...item,
              description: item.showDescriptionInPdf ? item.description : "",
            })),
          skills,
          languages,
        });
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Función para Publicar al servidor
  const handlePublish = async () => {
    if (!data) return;

    setPublishing(true);

    try {
      const blob = await pdf(
        <CVDocument {...data} qrCode={qrImage} />,
      ).toBlob();

      const formData = new FormData();
      formData.append("file", blob, "cv.pdf");

      const res = await fetch(`${API_URL}/cv`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("CV Publicado y disponible para descarga", "success");
      } else {
        const errorText = await res.text();
        console.error("Error backend:", errorText);
        showToast("Error al publicar el CV", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión o generación", "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading || !data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Cargando datos...</div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white relative">
      {toast && (
        <div
          className={`fixed top-24 right-5 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-medium flex items-center gap-3 transform transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.message}
          <button
            onClick={() => setToast(null)}
            className="ml-4 opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md border-b border-gray-700 z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition font-medium"
          >
            <FaArrowLeft /> Volver al Dashboard
          </Link>
          <h1 className="text-xl font-bold hidden md:block border-l border-gray-600 pl-4">
            Vista Previa del CV
          </h1>
        </div>

        <div className="flex gap-3">
          {/* Botón publicar cv */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition shadow-lg ${
              publishing
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            <FaCloudUploadAlt />
            {publishing ? "Generando y Subiendo..." : "Publicar CV"}
          </button>
        </div>
      </div>

      {/* Visor pdf */}
      <div className="flex-grow bg-gray-700 p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border border-gray-600">
          <PDFViewer width="100%" height="100%" showToolbar={true}>
            <CVDocument {...data} qrCode={qrImage} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
