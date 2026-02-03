import React from "react";

export default function PdfVisibilityToggle({
  checked,
  onChange,
  color = "blue",
  label = "Incluir en el CV (PDF)",
}) {
  const bgColors = {
    blue: "peer-checked:bg-blue-600 group-hover:text-blue-700",
    green: "peer-checked:bg-green-600 group-hover:text-green-700",
    purple: "peer-checked:bg-purple-600 group-hover:text-purple-700",
    indigo: "peer-checked:bg-indigo-600 group-hover:text-indigo-700",
  };

  const activeClasses = bgColors[color] || bgColors.blue;
  // Extraemos la clase de fondo y la de texto (hack rápido basado en el string)
  const toggleClass = activeClasses.split(" ")[0];
  const textClass = activeClasses.split(" ")[1];

  return (
    <div className="bg-white/60 p-4 rounded-lg border border-gray-200 mt-4">
      <p className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2 text-gray-500">
        📄 Configuración de Exportación (PDF)
      </p>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked ?? true}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className={`w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${toggleClass}`}
          ></div>
        </div>
        <span
          className={`text-sm font-medium text-gray-700 transition-colors ${textClass}`}
        >
          {label}
        </span>
      </label>
    </div>
  );
}
