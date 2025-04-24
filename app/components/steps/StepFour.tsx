"use client";
import React from "react";

interface StepFourProps {
  purpose: string;
  setPurpose: React.Dispatch<React.SetStateAction<string>>;
  extraDetails: string;
  setExtraDetails: React.Dispatch<React.SetStateAction<string>>;
  selectedCuisines: string[];
  dietRestrictions: string[];
  extraAllergens: string;
  ingredientsToInclude: string[];
  ingredientsToExclude: string[];
  time: string;
  difficulty: string;
  cost: string;
  servings: number;
}

const purposes: string[] = [
  "Comida diaria",
  "Ocasión especial",
  "Cena romántica",
  "Reunión familiar",
  "Fiesta",
  "Saludable",
  "Deportiva",
  "Batch cooking",
];

export default function StepFour({
  purpose,
  setPurpose,
  extraDetails,
  setExtraDetails,
  selectedCuisines,
  dietRestrictions,
  extraAllergens,
  ingredientsToInclude,
  ingredientsToExclude,
  time,
  difficulty,
  cost,
  servings,
}: StepFourProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Propósito de la receta
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Para qué ocasión es esta receta?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {purposes.map((p: string) => (
            <button
              key={p}
              onClick={() => setPurpose(p)}
              className={`
                p-2 sm:p-3
                rounded-lg
                border
                text-sm sm:text-base
                transition-all
                duration-200
                ${
                  purpose === p
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Detalles adicionales
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Hay algo más que quieras mencionar?
        </p>
        <textarea
          value={extraDetails}
          onChange={(e) => setExtraDetails(e.target.value)}
          placeholder="Ej: Me gustaría que la receta sea saludable y fácil de preparar"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Resumen de preferencias
        </h2>

        <div className="space-y-4">
          {selectedCuisines.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Tipos de cocina:
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedCuisines.map((cuisine) => (
                  <span
                    key={cuisine}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm bg-orange-100 text-orange-800"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dietRestrictions.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Restricciones dietéticas:
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {dietRestrictions.map((diet) => (
                  <span
                    key={diet}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm bg-green-100 text-green-800"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ingredientsToInclude.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Ingredientes a incluir:
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {ingredientsToInclude.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ingredientsToExclude.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Ingredientes a evitar:
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {ingredientsToExclude.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm bg-red-100 text-red-800"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {extraAllergens && (
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Alergias adicionales:
              </h3>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                {extraAllergens}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Tiempo:
              </h3>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                {time === "quick"
                  ? "Rápido"
                  : time === "medium"
                    ? "Medio"
                    : "Largo"}
              </p>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Dificultad:
              </h3>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                {difficulty === "basic"
                  ? "Básico"
                  : difficulty === "intermediate"
                    ? "Intermedio"
                    : "Avanzado"}
              </p>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Coste:
              </h3>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                {cost === "low"
                  ? "Económico"
                  : cost === "medium"
                    ? "Moderado"
                    : "Premium"}
              </p>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                Porciones:
              </h3>
              <p className="mt-1 text-sm sm:text-base text-gray-600">
                {servings}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
