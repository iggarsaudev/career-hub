import { useLanguage } from "../context/LanguageContext";

export default function EducationList({ educations }) {
  const { language } = useLanguage();
  if (!educations || educations.length === 0) return null;

  return (
    <div className="space-y-6">
      {educations.map((edu) => {
        const degree =
          language === "en" && edu.degree_en ? edu.degree_en : edu.degree;
        const description =
          language === "en" && edu.description_en
            ? edu.description_en
            : edu.description;
        const currentText = language === "en" ? "Present" : "Actualidad";

        return (
          <div
            key={edu.id}
            className="bg-white dark:bg-gray-950 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              🎓
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {degree}
                </h3>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  {new Date(edu.startDate).getFullYear()} -{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : currentText}
                </span>
              </div>

              <p className="text-purple-700 dark:text-purple-400 font-medium mb-2">
                {edu.school}
              </p>

              {description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
