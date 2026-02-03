import { useState } from "react";

export function useForm(initialState) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    // Si recibimos un evento nativo de React (input normal)
    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Para campos especiales que no usan eventos nativos (ej: ImageUpload o Toggles custom)
  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reiniciar formulario al estado inicial o a uno nuevo
  const resetForm = (newState = initialState) => {
    setForm(newState);
  };

  return { form, handleChange, setField, resetForm, setForm };
}
