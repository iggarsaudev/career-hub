import { useLanguage } from "../context/LanguageContext";

export default function Timeline({ experiences }) {
  const { language } = useLanguage();

  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 md:ml-6 space-y-12 py-4">
      {experiences.map((exp) => {
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
            <div className="absolute -left-[9px] top-0 bg-white dark:bg-gray-900 border-4 border-green-500 w-5 h-5 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">
                  {position}
                </h3>
                <h4 className="text-lg text-green-700 dark:text-green-400 font-semibold mt-1">
                  {exp.company}
                </h4>
              </div>

              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                {new Date(exp.startDate).toLocaleDateString(locale, {
                  month: "short",
                  year: "numeric",
                })}
                {" - "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString(locale, {
                      month: "short",
                      year: "numeric",
                    })
                  : currentText}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl text-sm md:text-base bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-50 dark:border-gray-800 group-hover:border-gray-100 dark:group-hover:border-gray-700 group-hover:shadow-sm transition-all whitespace-pre-line">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
