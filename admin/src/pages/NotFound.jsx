import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
        404
      </h1>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          ¡Ups! Página no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Parece que te has perdido en el ciberespacio.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
