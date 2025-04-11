"use client";
import React, { useState } from "react";

interface StepTwoProps {
  ingredientsToInclude: string[];
  setIngredientsToInclude: React.Dispatch<React.SetStateAction<string[]>>;
  ingredientsToExclude: string[];
  setIngredientsToExclude: React.Dispatch<React.SetStateAction<string[]>>;
  extraAllergens: string;
  setExtraAllergens: React.Dispatch<React.SetStateAction<string>>;
}

export default function StepTwo({
  ingredientsToInclude,
  setIngredientsToInclude,
  ingredientsToExclude,
  setIngredientsToExclude,
  extraAllergens,
  setExtraAllergens,
}: StepTwoProps) {
  const [inputInclude, setInputInclude] = useState("");
  const [inputExclude, setInputExclude] = useState("");

  const handleAddInclude = () => {
    if (inputInclude.trim() !== "") {
      setIngredientsToInclude([...ingredientsToInclude, inputInclude.trim()]);
      setInputInclude("");
    }
  };

  const handleAddExclude = () => {
    if (inputExclude.trim() !== "") {
      setIngredientsToExclude([...ingredientsToExclude, inputExclude.trim()]);
      setInputExclude("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Personaliza los ingredientes de tu receta
        </h1>
        <p className="text-gray-600">
          Opcionalmente, puedes especificar ingredientes que te gustaría incluir
          o excluir en tu receta.
        </p>
      </div>

      {/* Incluir ingredientes */}
      <div>
        <h2 className="font-semibold mb-2">Ingredientes a incluir</h2>
        <div className="flex items-center gap-2 mb-3">
          <input
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={inputInclude}
            onChange={(e) => setInputInclude(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddInclude()}
            placeholder="ej: pollo, tomates..."
          />
          <button
            onClick={handleAddInclude}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300"
            disabled={!inputInclude.trim()}
          >
            Agregar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredientsToInclude.map((ingredient, idx) => (
            <span
              key={idx}
              className="inline-flex items-center bg-orange-100 text-orange-600 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-200 transition-colors"
              onClick={() =>
                setIngredientsToInclude(
                  ingredientsToInclude.filter((i) => i !== ingredient)
                )
              }
            >
              {ingredient}
              <span className="ml-2 text-sm hover:text-orange-800">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Excluir ingredientes */}
      <div>
        <h2 className="font-semibold mb-2">Ingredientes a excluir</h2>
        <div className="flex items-center gap-2 mb-3">
          <input
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={inputExclude}
            onChange={(e) => setInputExclude(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddExclude()}
            placeholder="ej: mariscos, nueces..."
          />
          <button
            onClick={handleAddExclude}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300"
            disabled={!inputExclude.trim()}
          >
            Agregar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredientsToExclude.map((ingredient, idx) => (
            <span
              key={idx}
              className="inline-flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full cursor-pointer hover:bg-red-200 transition-colors"
              onClick={() =>
                setIngredientsToExclude(
                  ingredientsToExclude.filter((i) => i !== ingredient)
                )
              }
            >
              {ingredient}
              <span className="ml-2 text-sm hover:text-red-800">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Alergias adicionales */}
      <div>
        <h2 className="font-semibold mb-2">
          Alergias o intolerancias adicionales
        </h2>
        <textarea
          value={extraAllergens}
          onChange={(e) => setExtraAllergens(e.target.value)}
          placeholder="Describe cualquier alergia o intolerancia adicional que debamos tener en cuenta..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
        />
      </div>
    </div>
  );
}
