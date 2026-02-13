import React, { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import CVDocument from "../pdf/CVDocument";
import { API_URL } from "../../config";
import QRCode from "qrcode";

export default function CVPreview() {
  const [data, setData] = useState({
    profile: null,
    experience: [],
    education: [],
    skills: [],
    languages: [],
  });
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState(null);

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
          // experiencia
          experience: experience
            // Filtramos solo los que tengan isVisibleInPdf en TRUE
            .filter((item) => item.isVisibleInPdf === true)
            // Pi showDescriptionInPdf es FALSE, borramos la descripción
            .map((item) => ({
              ...item,
              description: item.showDescriptionInPdf ? item.description : "",
            })),
          // educación (misma lógica)
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
        console.error("Error cargando datos para el CV:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">
          Cargando datos y aplicando filtros...
        </div>
      </div>
    );

  const fileName = `CV_${data.profile?.name?.replace(/\s+/g, "_") || "Portfolio"}.pdf`;

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
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
        <PDFDownloadLink
          document={<CVDocument {...data} qrCode={qrImage} />}
          fileName={fileName}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          {({ loading }) => (
            <>
              <FaDownload /> {loading ? "Generando..." : "Descargar PDF"}
            </>
          )}
        </PDFDownloadLink>
      </div>
      <div className="flex-grow bg-gray-700 p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border border-gray-600">
          <PDFViewer
            width="100%"
            height="100%"
            className="w-full h-full"
            showToolbar={true}
          >
            <CVDocument {...data} qrCode={qrImage} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
