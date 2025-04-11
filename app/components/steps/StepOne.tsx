"use client";
import React from "react";

interface StepOneProps {
  selectedCuisines: string[];
  setSelectedCuisines: React.Dispatch<React.SetStateAction<string[]>>;
  dietRestrictions: string[];
  setDietRestrictions: React.Dispatch<React.SetStateAction<string[]>>;
}

// Ejemplo de arrays
const CUISINE_OPTIONS = [
  "Italiana",
  "Mexicana",
  "China",
  "India",
  "Japonesa",
  "Americana",
  "Tailandesa",
  "Vietnamita",
  "Coreana",
  "Francesa",
  "Griega",
  "Española",
  "Alemana",
  "Mediterránea",
  "Peruana",
  "Argentina",
  "Brasileña",
  "Marroquí",
];

const DIET_OPTIONS = [
  "Vegetariana",
  "Vegana",
  "Sin Gluten",
  "Sin Lácteos",
  "Pescetariana",
  "Paleo",
  "Baja en Carbohidratos",
  "Cetogénica",
  "Sin Frutos Secos",
  "Sin Soja",
  "Sin Azúcar Añadido",
  "Mediterránea",
  "DASH",
  "Sin Huevo",
  "Sin Mariscos",
];

export default function StepOne({
  selectedCuisines,
  setSelectedCuisines,
  dietRestrictions,
  setDietRestrictions,
}: StepOneProps) {
  // Función para toggle en un array (chips)
  const toggleCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const toggleDiet = (diet: string) => {
    if (dietRestrictions.includes(diet)) {
      setDietRestrictions(dietRestrictions.filter((d) => d !== diet));
    } else {
      setDietRestrictions([...dietRestrictions, diet]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">¿Qué tipo de cocina te gustaría?</h1>
        <p className="text-gray-600">
          Puedes seleccionar los tipos de cocina que prefieras y especificar
          cualquier restricción dietética.
        </p>
      </div>

      {/* Tipos de cocina */}
      <div>
        <h2 className="font-semibold mb-4">Tipos de Cocina</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CUISINE_OPTIONS.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`p-3 rounded-lg text-sm transition-all transform hover:scale-105 ${
                selectedCuisines.includes(cuisine)
                  ? "bg-orange-100 text-orange-700 border-2 border-orange-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restricciones dietéticas */}
      <div>
        <h2 className="font-semibold mb-4">Restricciones Dietéticas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DIET_OPTIONS.map((diet) => (
            <button
              key={diet}
              onClick={() => toggleDiet(diet)}
              className={`p-3 rounded-lg text-sm transition-all transform hover:scale-105 ${
                dietRestrictions.includes(diet)
                  ? "bg-green-100 text-green-700 border-2 border-green-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
