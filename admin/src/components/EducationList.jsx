export default function EducationList({ educations }) {
  if (!educations || educations.length === 0) return null;

  return (
    <div className="space-y-6">
      {educations.map((edu) => (
        <div
          key={edu.id}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
        >
          {/* Icono */}
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            🎓
          </div>

          {/* Contenido */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {new Date(edu.startDate).getFullYear()} -{" "}
                {edu.endDate
                  ? new Date(edu.endDate).getFullYear()
                  : "Actualidad"}
              </span>
            </div>

            <p className="text-purple-700 font-medium mb-2">{edu.school}</p>

            {edu.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {edu.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
