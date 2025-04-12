"use client";
import React from "react";
import {
  ClockIcon,
  ChartBarIcon,
  BanknotesIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

interface StepThreeProps {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  cost: string;
  setCost: React.Dispatch<React.SetStateAction<string>>;
  servings: number;
  setServings: React.Dispatch<React.SetStateAction<number>>;
}

const timeOptions = [
  { value: "quick", label: "Rápido" },
  { value: "medium", label: "Medio" },
  { value: "long", label: "Largo" },
];

const difficultyOptions = [
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

const costOptions = [
  { value: "low", label: "Económico" },
  { value: "medium", label: "Moderado" },
  { value: "high", label: "Premium" },
];

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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Tiempo de preparación
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Cuánto tiempo quieres dedicar a cocinar?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTime(option.value)}
              className={`
                p-3 sm:p-4
                rounded-lg
                border
                transition-all
                duration-200
                flex
                flex-col
                items-center
                gap-2
                text-sm sm:text-base
                ${
                  time === option.value
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Dificultad</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Qué nivel de dificultad prefieres?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setDifficulty(option.value)}
              className={`
                p-3 sm:p-4
                rounded-lg
                border
                transition-all
                duration-200
                flex
                flex-col
                items-center
                gap-2
                text-sm sm:text-base
                ${
                  difficulty === option.value
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Coste</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Qué presupuesto tienes en mente?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          {costOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setCost(option.value)}
              className={`
                p-3 sm:p-4
                rounded-lg
                border
                transition-all
                duration-200
                flex
                flex-col
                items-center
                gap-2
                text-sm sm:text-base
                ${
                  cost === option.value
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }
              `}
            >
              <BanknotesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Porciones</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          ¿Para cuántas personas quieres cocinar?
        </p>
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <button
            onClick={() => setServings((prev) => Math.max(1, prev - 1))}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <MinusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <span className="text-2xl sm:text-3xl font-semibold text-gray-800 min-w-[3ch] text-center">
            {servings}
          </span>
          <button
            onClick={() => setServings((prev) => Math.min(12, prev + 1))}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
