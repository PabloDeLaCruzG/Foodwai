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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Tipo de cocina
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Selecciona los tipos de cocina que te gustaría explorar
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {CUISINE_OPTIONS.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`
                p-2 sm:p-3 
                rounded-lg 
                text-sm sm:text-base
                border 
                transition-all 
                duration-200
                ${
                  selectedCuisines.includes(cuisine)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Restricciones dietéticas
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Selecciona si tienes alguna restricción dietética
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {DIET_OPTIONS.map((diet) => (
            <button
              key={diet}
              onClick={() => toggleDiet(diet)}
              className={`
                p-2 sm:p-3 
                rounded-lg 
                text-sm sm:text-base
                border 
                transition-all 
                duration-200
                ${
                  dietRestrictions.includes(diet)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
