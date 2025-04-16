"use client";
import React, { useState } from "react";
import ErrorMessage from "../ErrorMessage";
import {
  ClockIcon,
  BanknotesIcon,
  UserIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";

interface StepThreeProps {
  time: string;
  setTime: (time: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  cost: string;
  setCost: (cost: string) => void;
  servings: number;
  setServings: (servings: number) => void;
}

// const timeOptions = [
//   { value: "quick", label: "Rápido" },
//   { value: "medium", label: "Medio" },
//   { value: "long", label: "Largo" },
// ];

// const difficultyOptions = [
//   { value: "basic", label: "Básico" },
//   { value: "intermediate", label: "Intermedio" },
//   { value: "advanced", label: "Avanzado" },
// ];

// const costOptions = [
//   { value: "low", label: "Económico" },
//   { value: "medium", label: "Moderado" },
//   { value: "high", label: "Premium" },
// ];

export default function StepThree({
  time,
  setTime,
  difficulty,
  setDifficulty,
  cost,
  setCost,
  servings,
  setServings,
}: StepThreeProps) {
  const [error, setError] = useState<string | null>(null);

  const handleServingsChange = (newServings: number) => {
    try {
      if (newServings < 1) {
        throw new Error("El número de porciones debe ser al menos 1");
      }
      if (newServings > 12) {
        throw new Error("El número máximo de porciones es 12");
      }
      setServings(newServings);
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
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900">
          <ClockIcon className="w-5 h-5 text-orange-500" />
          Tiempo de preparación
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTime("quick")}
            className={`p-3 rounded-lg text-center transition-all ${
              time === "quick"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Rápido</span>
            <span className="text-xs text-gray-500">15-30 min</span>
          </button>
          <button
            onClick={() => setTime("medium")}
            className={`p-3 rounded-lg text-center transition-all ${
              time === "medium"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Medio</span>
            <span className="text-xs text-gray-500">30-60 min</span>
          </button>
          <button
            onClick={() => setTime("long")}
            className={`p-3 rounded-lg text-center transition-all ${
              time === "long"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Elaborado</span>
            <span className="text-xs text-gray-500">60 min</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900">
          <BeakerIcon className="w-5 h-5 text-orange-500" />
          Nivel de dificultad
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setDifficulty("basic")}
            className={`p-3 rounded-lg text-center transition-all ${
              difficulty === "basic"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Básico</span>
            <span className="text-xs text-gray-500">Para principiantes</span>
          </button>
          <button
            onClick={() => setDifficulty("intermediate")}
            className={`p-3 rounded-lg text-center transition-all ${
              difficulty === "intermediate"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Intermedio</span>
            <span className="text-xs text-gray-500">Algo de experiencia</span>
          </button>
          <button
            onClick={() => setDifficulty("advanced")}
            className={`p-3 rounded-lg text-center transition-all ${
              difficulty === "advanced"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Avanzado</span>
            <span className="text-xs text-gray-500">Chef experimentado</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900">
          <BanknotesIcon className="w-5 h-5 text-orange-500" />
          Nivel de costo
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setCost("low")}
            className={`p-3 rounded-lg text-center transition-all ${
              cost === "low"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Económico</span>
            <span className="text-xs text-gray-500">{"< 10€"}</span>
          </button>
          <button
            onClick={() => setCost("medium")}
            className={`p-3 rounded-lg text-center transition-all ${
              cost === "medium"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Moderado</span>
            <span className="text-xs text-gray-500">10-20€</span>
          </button>
          <button
            onClick={() => setCost("high")}
            className={`p-3 rounded-lg text-center transition-all ${
              cost === "high"
                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="block text-sm font-medium">Premium</span>
            <span className="text-xs text-gray-500">{"> 20€"}</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900">
          <UserIcon className="w-5 h-5 text-orange-500" />
          Número de porciones
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleServingsChange(servings - 1)}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={servings <= 1}
          >
            -
          </button>
          <span className="text-lg font-medium text-gray-900 w-8 text-center">
            {servings}
          </span>
          <button
            onClick={() => handleServingsChange(servings + 1)}
            className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={servings >= 12}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
