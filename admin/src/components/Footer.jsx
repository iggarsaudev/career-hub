import React from "react";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function Footer({ profile }) {
  const { language } = useLanguage();

  const githubLink = "https://github.com/iggarsaudev";
  const linkedinLink = "www.linkedin.com/in/ignacio-garcia-sausor";

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Info Izquierda */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold tracking-tight mb-1">
            {profile?.name || "Portfolio"}
          </h3>
          <p className="text-gray-400 text-sm">
            {language === "en"
              ? "Full Stack Developer"
              : "Desarrollador Full Stack"}
          </p>
        </div>

        {/* Redes Sociales */}
        <div className="flex gap-6">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-white transition transform hover:scale-110"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href={linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-blue-400 transition transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm flex items-center gap-1">
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
