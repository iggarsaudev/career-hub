import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ruta para el login */}
        <Route path="/login" element={<Login />} />

        {/* ruta principal (dashboard) */}
        <Route path="/" element={<Dashboard />} />

        {/* cualquier otra ruta nos manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
