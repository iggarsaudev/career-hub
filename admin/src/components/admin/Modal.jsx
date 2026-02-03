import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, className = "" }) {
  // Cierra el modal con la tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300">
      {/* Capa de fondo (al hacer click aquí se cierra) */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Contenedor de la tarjeta */}
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-fade-in z-10 border ${className}`}
        onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
