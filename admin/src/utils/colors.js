export const getTechColor = (techName) => {
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-teal-100 text-teal-800 border-teal-200",
  ];
  // Sumamos los códigos de las letras para elegir siempre el mismo color para el mismo nombre
  let hash = 0;
  for (let i = 0; i < techName.length; i++) {
    hash += techName.charCodeAt(i);
  }

  return colors[hash % colors.length];
};
