import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // buscamos si hay un "token" guardado en el navegador
  const isAuthenticated = localStorage.getItem("adminToken");

  if (!isAuthenticated) {
    // si no tiene token, lo mandamos al login
    return <Navigate to="/login" replace />;
  }

  // si tiene token, le dejamos ver el contenido (children)
  return children;
}
