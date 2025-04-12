"use client";
import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

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
  const [newIngredient, setNewIngredient] = useState("");
  const [newExcludedIngredient, setNewExcludedIngredient] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredientsToInclude([...ingredientsToInclude, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredientsToInclude(
      ingredientsToInclude.filter((i) => i !== ingredient)
    );
  };

  const handleAddExcludedIngredient = () => {
    if (newExcludedIngredient.trim()) {
      setIngredientsToExclude([
        ...ingredientsToExclude,
        newExcludedIngredient.trim(),
      ]);
      setNewExcludedIngredient("");
    }
  };

  const handleRemoveExcludedIngredient = (ingredient: string) => {
    setIngredientsToExclude(
      ingredientsToExclude.filter((i) => i !== ingredient)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleExcludedKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddExcludedIngredient();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Ingredientes principales
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Qué ingredientes te gustaría incluir en tu receta?
        </p>
        <div className="flex flex-wrap gap-2">
          {ingredientsToInclude.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(ingredient)}
                className="hover:text-green-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un ingrediente"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddIngredient}
            disabled={!newIngredient.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Añadir
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Ingredientes a evitar
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Hay algún ingrediente que prefieras no usar?
        </p>
        <div className="flex flex-wrap gap-2">
          {ingredientsToExclude.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveExcludedIngredient(ingredient)}
                className="hover:text-red-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newExcludedIngredient}
            onChange={(e) => setNewExcludedIngredient(e.target.value)}
            onKeyPress={handleExcludedKeyPress}
            placeholder="Escribe un ingrediente"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddExcludedIngredient}
            disabled={!newExcludedIngredient.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Añadir
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Alergias adicionales
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Menciona cualquier otra alergia o ingrediente a evitar
        </p>
        <textarea
          value={extraAllergens}
          onChange={(e) => setExtraAllergens(e.target.value)}
          placeholder="Ej: Soy alérgico al kiwi y a los mariscos"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
        />
      </div>
    </div>
  );
}
