import React from "react";

export default function AdminItemCard({
  title,
  subtitle,
  image,
  topBadges, // Array de componentes para la parte superior derecha
  tags, // Array de objetos { text, colorClass } para los tags
  onEdit,
  onDelete,
  children, // Contenido central (descripción)
  withImageSection = false,
}) {
  return (
    <div className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 bg-white flex flex-col h-full">
      {/* Sección imagen */}
      {/* Solo se renderiza si le pasas withImageSection={true} */}
      {withImageSection && (
        <div className="h-48 bg-gray-100 w-full relative overflow-hidden flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-4xl mb-2">📷</span>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Cabecera: Título y Badges Superiores */}
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-lg text-gray-800 leading-tight">
            {title}
          </h3>
          <div className="flex flex-wrap gap-1 justify-end shrink-0">
            {topBadges}
          </div>
        </div>

        {/* Subtítulo (ej: Fechas, Lugar, Idioma) */}
        {subtitle && (
          <p className="text-xs text-gray-400 mb-3 font-medium">{subtitle}</p>
        )}

        {/* Tags (ej: Tech Stack) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tag.colorClass}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        )}

        {/* Descripción (Children) */}
        <div className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 whitespace-pre-line">
          {children}
        </div>

        {/* Botones de acción */}
        <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
