"use client";
import React, { useState } from "react";
import ErrorMessage from "../ErrorMessage";

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

// const purposes: string[] = [
//   "Comida diaria",
//   "Ocasión especial",
//   "Cena romántica",
//   "Reunión familiar",
//   "Fiesta",
//   "Saludable",
//   "Deportiva",
//   "Batch cooking",
// ];

const timeLabels: Record<string, string> = {
  quick: "Rápido (15-30 min)",
  medium: "Medio (30-60 min)",
  long: "Elaborado (>60 min)",
};

const difficultyLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const costLabels: Record<string, string> = {
  low: "Económico (<10€)",
  medium: "Moderado (10-20€)",
  high: "Premium (>20€)",
};

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
  const [error, setError] = useState<string | null>(null);

  const handlePurposeChange = (value: string) => {
    try {
      if (value.length > 200) {
        throw new Error("El propósito no puede exceder los 200 caracteres");
      }
      setPurpose(value);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleExtraDetailsChange = (value: string) => {
    try {
      if (value.length > 500) {
        throw new Error(
          "Los detalles adicionales no pueden exceder los 500 caracteres"
        );
      }
      setExtraDetails(value);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-8">
      {error && <ErrorMessage message={error} className="animate-slideIn" />}

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Resumen de preferencias
        </h3>
        <div className="bg-orange-50 rounded-lg p-4 space-y-4">
          {selectedCuisines.length > 0 && (
            <div>
              <span className="text-sm font-medium text-orange-800">
                Tipo de cocina:
              </span>
              <span className="text-sm text-orange-700 ml-2">
                {selectedCuisines.join(", ")}
              </span>
            </div>
          )}

          {dietRestrictions.length > 0 && (
            <div>
              <span className="text-sm font-medium text-orange-800">
                Restricciones dietéticas:
              </span>
              <span className="text-sm text-orange-700 ml-2">
                {dietRestrictions.join(", ")}
              </span>
            </div>
          )}

          {extraAllergens && (
            <div>
              <span className="text-sm font-medium text-orange-800">
                Alergias/Intolerancias:
              </span>
              <span className="text-sm text-orange-700 ml-2">
                {extraAllergens}
              </span>
            </div>
          )}

          {ingredientsToInclude.length > 0 && (
            <div>
              <span className="text-sm font-medium text-orange-800">
                Ingredientes a incluir:
              </span>
              <span className="text-sm text-orange-700 ml-2">
                {ingredientsToInclude.join(", ")}
              </span>
            </div>
          )}

          {ingredientsToExclude.length > 0 && (
            <div>
              <span className="text-sm font-medium text-orange-800">
                Ingredientes a excluir:
              </span>
              <span className="text-sm text-orange-700 ml-2">
                {ingredientsToExclude.join(", ")}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <span className="text-sm font-medium text-orange-800 block">
                Tiempo:
              </span>
              <span className="text-sm text-orange-700">
                {timeLabels[time]}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-orange-800 block">
                Dificultad:
              </span>
              <span className="text-sm text-orange-700">
                {difficultyLabels[difficulty]}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-orange-800 block">
                Costo:
              </span>
              <span className="text-sm text-orange-700">
                {costLabels[cost]}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-orange-800 block">
                Porciones:
              </span>
              <span className="text-sm text-orange-700">{servings}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          ¿Para qué ocasión es la receta?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Por ejemplo: cena romántica, comida familiar, etc.
        </p>
        <textarea
          value={purpose}
          onChange={(e) => handlePurposeChange(e.target.value)}
          placeholder="Describe la ocasión..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
          maxLength={200}
        />
        <p className="text-sm text-gray-500 mt-1">
          {purpose.length}/200 caracteres
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Detalles adicionales
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ¿Alguna preferencia específica que debamos tener en cuenta?
        </p>
        <textarea
          value={extraDetails}
          onChange={(e) => handleExtraDetailsChange(e.target.value)}
          placeholder="Por ejemplo: preferencia de sabores, técnicas de cocina específicas..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-1">
          {extraDetails.length}/500 caracteres
        </p>
      </div>
    </div>
  );
}
