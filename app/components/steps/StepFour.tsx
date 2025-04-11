"use client";
import React from "react";

interface StepFourProps {
  purpose: string;
  setPurpose: React.Dispatch<React.SetStateAction<string>>;
  extraDetails: string;
  setExtraDetails: React.Dispatch<React.SetStateAction<string>>;
  // Para resumen
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
  // Funciones de mapeo para mostrar valores en español
  const mapTime = (val: string) => {
    const timeMap: { [key: string]: string } = {
      quick: "Rápido (15-30 min)",
      medium: "Medio (30-60 min)",
      long: "Largo (más de 60 min)",
    };
    return timeMap[val] || val;
  };

  const mapDifficulty = (val: string) => {
    const difficultyMap: { [key: string]: string } = {
      basic: "Básico",
      intermediate: "Intermedio",
      advanced: "Avanzado",
    };
    return difficultyMap[val] || val;
  };

  const mapCost = (val: string) => {
    const costMap: { [key: string]: string } = {
      low: "Económico",
      medium: "Moderado",
      high: "Premium",
    };
    return costMap[val] || val;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Resumen y detalles finales</h1>
        <p className="text-gray-600">
          Revisa tus selecciones y agrega cualquier detalle adicional.
        </p>
      </div>

      {/* Propósito */}
      <div className="space-y-2">
        <h2 className="font-semibold">¿Para qué ocasión es esta receta? (opcional)</h2>
        <p className="text-sm text-gray-500 mb-2">Puedes generar la receta sin especificar una ocasión</p>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="ej: Cena romántica, Almuerzo familiar, Comida saludable..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Detalles extra */}
      <div className="space-y-2">
        <h2 className="font-semibold">Detalles adicionales (opcional)</h2>
        <textarea
          value={extraDetails}
          onChange={(e) => setExtraDetails(e.target.value)}
          placeholder="¿Hay algo más que deberíamos saber? Por ejemplo: preferencias de sabor, técnicas específicas..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
        />
      </div>

      {/* Resumen de selecciones */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h2 className="font-semibold text-lg mb-4">
          Resumen de tus preferencias
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <h3 className="font-medium text-gray-700">Tipo de cocina</h3>
              <p className="text-gray-600">
                {selectedCuisines.join(", ") || "No seleccionado"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">
                Restricciones dietéticas
              </h3>
              <p className="text-gray-600">
                {dietRestrictions.join(", ") || "Ninguna"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Alergias</h3>
              <p className="text-gray-600">{extraAllergens || "Ninguna"}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">
                Ingredientes a incluir
              </h3>
              <p className="text-gray-600">
                {ingredientsToInclude.join(", ") || "Ninguno"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="font-medium text-gray-700">
                Ingredientes a excluir
              </h3>
              <p className="text-gray-600">
                {ingredientsToExclude.join(", ") || "Ninguno"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Tiempo</h3>
              <p className="text-gray-600">{mapTime(time)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Dificultad</h3>
              <p className="text-gray-600">{mapDifficulty(difficulty)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Costo</h3>
              <p className="text-gray-600">{mapCost(cost)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Porciones</h3>
              <p className="text-gray-600">{servings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
