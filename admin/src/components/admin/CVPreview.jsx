import React, { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaDownload,
  FaSync,
} from "react-icons/fa";
import CVDocument from "../pdf/CVDocument";
import { API_URL } from "../../config";
import QRCode from "qrcode";

export default function CVPreview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [generating, setGenerating] = useState(false);
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

        const urlParaQR =
          profile.portfolioUrl || "https://iggarsaudev-career-hub.vercel.app/";
        const qrDataUrl = await QRCode.toDataURL(urlParaQR, {
          margin: 1,
          color: { dark: "#1B3864" },
        });
        setQrImage(qrDataUrl);

        setData({
          profile,
          experience: experience.filter((item) => item.isVisibleInPdf === true),
          education: education.filter((item) => item.isVisibleInPdf === true),
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

  useEffect(() => {
    if (data && qrImage) {
      generatePdfBlob();
    }
  }, [data, qrImage]);

  const generatePdfBlob = async () => {
    setGenerating(true);
    try {
      const blob = await pdf(
        <CVDocument {...data} qrCode={qrImage} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
      showToast("Error al generar la vista previa", "error");
    } finally {
      setGenerating(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePublish = async () => {
    if (!pdfBlob) return;
    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append("file", pdfBlob, "cv.pdf");

      const res = await fetch(`${API_URL}/cv`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("CV Publicado correctamente", "success");
      } else {
        showToast("Error al publicar el CV", "error");
      }
    } catch (error) {
      showToast("Error de conexión", "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Cargando datos...</div>
      </div>
    );
  }

  // Nombre correcto para la descarga manual
  const fileName = `CV_${data.profile?.name?.replace(/\s+/g, "_") || "CV_Ignacio_Garcia_Sausor"}.pdf`;

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white relative">
      {toast && (
        <div
          className={`fixed top-24 right-5 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-medium flex items-center gap-3 transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.message}
        </div>
      )}
      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md border-b border-gray-700 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition font-medium"
          >
            <FaArrowLeft /> Volver al Dashboard
          </Link>
          <h1 className="text-xl font-bold hidden md:block border-l border-gray-600 pl-4">
            Vista Previa
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generatePdfBlob}
            disabled={generating}
            className="p-2 text-gray-400 hover:text-white transition"
            title="Regenerar PDF"
          >
            <FaSync className={generating ? "animate-spin" : ""} />
          </button>

          {/* Botón descargar cv*/}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={fileName}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded transition shadow-lg"
            >
              <FaDownload /> <span className="hidden sm:inline">Descargar</span>
            </a>
          )}

          {/* Botón Publicar */}
          <button
            onClick={handlePublish}
            disabled={publishing || generating || !pdfBlob}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition shadow-lg ${
              publishing || generating
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            <FaCloudUploadAlt />
            {publishing ? "Subiendo..." : "Publicar CV"}
          </button>
        </div>
      </div>

      {/* Visor pdf */}
      <div className="flex-grow bg-gray-700 p-4 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border border-gray-600 bg-white relative">
          {generating ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Generando vista previa...
            </div>
          ) : pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none"
              title="Vista Previa PDF"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              No se pudo cargar la vista previa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
