import { useLanguage } from "../context/LanguageContext";

export default function Timeline({ experiences }) {
  const { language } = useLanguage();

  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-12 py-4">
      {experiences.map((exp) => {
        // Lógica dinámica por ítem
        const position =
          language === "en" && exp.position_en ? exp.position_en : exp.position;
        const description =
          language === "en" && exp.description_en
            ? exp.description_en
            : exp.description;
        const currentText = language === "en" ? "PRESENT" : "ACTUALIDAD";
        const locale = language === "en" ? "en-US" : "es-ES";

        return (
          <div key={exp.id} className="relative pl-8 md:pl-12 group">
            {/* El Punto en la línea temporal */}
            <div className="absolute -left-[9px] top-0 bg-white border-4 border-green-500 w-5 h-5 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>

            {/* Contenido de la tarjeta */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-800 leading-none">
                  {position}
                </h3>
                <h4 className="text-lg text-green-700 font-semibold mt-1">
                  {exp.company}
                </h4>
              </div>

              {/* Fecha */}
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                {new Date(exp.startDate).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })}
                {" - "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString("es-ES", {
                      month: "short",
                      year: "numeric",
                    })
                  : currentText}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 leading-relaxed max-w-2xl text-sm md:text-base bg-gray-50 p-4 rounded-lg border border-gray-50 group-hover:border-gray-100 group-hover:shadow-sm transition-all">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
