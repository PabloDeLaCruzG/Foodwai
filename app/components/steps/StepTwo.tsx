"use client";
import React, { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ErrorMessage from "../ErrorMessage";

interface StepTwoProps {
  ingredientsToInclude: string[];
  setIngredientsToInclude: (ingredients: string[]) => void;
  ingredientsToExclude: string[];
  setIngredientsToExclude: (ingredients: string[]) => void;
  extraAllergens: string;
  setExtraAllergens: (allergens: string) => void;
}

export default function StepTwo({
  ingredientsToInclude,
  setIngredientsToInclude,
  ingredientsToExclude,
  setIngredientsToExclude,
  extraAllergens,
  setExtraAllergens,
}: StepTwoProps) {
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateIngredient = (ingredient: string) => {
    if (!ingredient.trim()) {
      throw new Error("El ingrediente no puede estar vacío");
    }
    if (ingredient.length < 2) {
      throw new Error("El ingrediente debe tener al menos 2 caracteres");
    }
    if (ingredient.length > 50) {
      throw new Error("El ingrediente no puede tener más de 50 caracteres");
    }
    if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(ingredient)) {
      throw new Error("El ingrediente solo puede contener letras y espacios");
    }
  };

  const handleAddIngredient = (type: "include" | "exclude") => {
    try {
      const ingredient =
        type === "include" ? includeInput.trim() : excludeInput.trim();
      validateIngredient(ingredient);

      if (type === "include") {
        if (ingredientsToInclude.includes(ingredient)) {
          throw new Error("Este ingrediente ya está en la lista de inclusión");
        }
        if (ingredientsToInclude.length >= 10) {
          throw new Error(
            "No puedes agregar más de 10 ingredientes para incluir"
          );
        }
        setIngredientsToInclude([...ingredientsToInclude, ingredient]);
        setIncludeInput("");
      } else {
        if (ingredientsToExclude.includes(ingredient)) {
          throw new Error("Este ingrediente ya está en la lista de exclusión");
        }
        if (ingredientsToExclude.length >= 5) {
          throw new Error(
            "No puedes agregar más de 5 ingredientes para excluir"
          );
        }
        setIngredientsToExclude([...ingredientsToExclude, ingredient]);
        setExcludeInput("");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleRemoveIngredient = (
    ingredient: string,
    type: "include" | "exclude"
  ) => {
    try {
      if (type === "include") {
        setIngredientsToInclude(
          ingredientsToInclude.filter((i) => i !== ingredient)
        );
      } else {
        setIngredientsToExclude(
          ingredientsToExclude.filter((i) => i !== ingredient)
        );
      }
    } catch {
      setError("Error al eliminar el ingrediente");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {error && <ErrorMessage message={error} className="animate-slideIn" />}

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Ingredientes que quieres incluir
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Máx. 10)
          </span>
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ¿Qué ingredientes te gustaría usar en tu receta?
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={includeInput}
            onChange={(e) => setIncludeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddIngredient("include");
              }
            }}
            placeholder="Ej: tomate"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={() => handleAddIngredient("include")}
            disabled={!includeInput.trim()}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredientsToInclude.map((ingredient) => (
            <span
              key={ingredient}
              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(ingredient, "include")}
                className="hover:text-orange-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Ingredientes que quieres excluir
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Máx. 5)
          </span>
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ¿Hay algún ingrediente que prefieras evitar?
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddIngredient("exclude");
              }
            }}
            placeholder="Ej: pimiento"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={() => handleAddIngredient("exclude")}
            disabled={!excludeInput.trim()}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredientsToExclude.map((ingredient) => (
            <span
              key={ingredient}
              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(ingredient, "exclude")}
                className="hover:text-red-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Alergias o intolerancias adicionales
        </h3>
        <textarea
          value={extraAllergens}
          onChange={(e) => setExtraAllergens(e.target.value)}
          placeholder="Describe cualquier alergia o intolerancia adicional..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
          maxLength={200}
        />
        <p className="text-sm text-gray-500 mt-1">
          {extraAllergens.length}/200 caracteres
        </p>
      </div>
    </div>
  );
}
