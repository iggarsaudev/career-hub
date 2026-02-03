import React from "react";

const focusColors = {
  blue: "focus:ring-blue-500",
  green: "focus:ring-green-500",
  purple: "focus:ring-purple-500",
  indigo: "focus:ring-indigo-500",
  gray: "focus:ring-gray-500",
};

export function FormInput({
  label,
  error,
  color = "blue",
  className = "",
  ...props
}) {
  const ringColor = focusColors[color] || focusColors.blue;

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 ${ringColor} transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  error,
  color = "blue",
  className = "",
  rows = 3,
  ...props
}) {
  const ringColor = focusColors[color] || focusColors.blue;

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 ${ringColor} transition-all resize-y ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
    </div>
  );
}
