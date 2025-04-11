"use client";
import React from "react";

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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Personaliza los detalles de tu receta
        </h1>
        <p className="text-gray-600">
          Ajusta estas opciones según tus preferencias. Todas son configurables
          y tienen valores predeterminados.
        </p>
      </div>

      {/* TIEMPO */}
      <div className="space-y-2">
        <h2 className="font-semibold">Tiempo estimado de preparación</h2>
        <div className="flex flex-col gap-2">
          {/* Rápido */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              time === "quick"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="time"
              value="quick"
              checked={time === "quick"}
              onChange={(e) => setTime(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Rápido</span>
                <p className="text-sm text-gray-600">15-30 minutos</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {time === "quick" && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
          </label>

          {/* Medio */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              time === "medium"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="time"
              value="medium"
              checked={time === "medium"}
              onChange={(e) => setTime(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Medio</span>
                <p className="text-sm text-gray-600">30-60 minutos</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {time === "medium" && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
          </label>

          {/* Largo */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              time === "long"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="time"
              value="long"
              checked={time === "long"}
              onChange={(e) => setTime(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Largo</span>
                <p className="text-sm text-gray-600">Más de 60 minutos</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {time === "long" && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* DIFICULTAD */}
      <div className="space-y-2">
        <h2 className="font-semibold">Nivel de dificultad</h2>
        <div className="flex flex-col gap-2">
          {/* Básico */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              difficulty === "basic"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              value="basic"
              checked={difficulty === "basic"}
              onChange={(e) => setDifficulty(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Básico</span>
                <p className="text-sm text-gray-600">Para principiantes</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {difficulty === "basic" && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
          </label>

          {/* Intermedio */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              difficulty === "intermediate"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              value="intermediate"
              checked={difficulty === "intermediate"}
              onChange={(e) => setDifficulty(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Intermedio</span>
                <p className="text-sm text-gray-600">
                  Algunas técnicas más avanzadas
                </p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {difficulty === "intermediate" && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
          </label>

          {/* Avanzado */}
          <label
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              difficulty === "advanced"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              value="advanced"
              checked={difficulty === "advanced"}
              onChange={(e) => setDifficulty(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Avanzado</span>
                <p className="text-sm text-gray-600">
                  Para cocineros experimentados
                </p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {difficulty === "advanced" && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* COSTO */}
      <div className="space-y-2">
        <h2 className="font-semibold">Nivel de costo</h2>
        <div className="flex gap-4">
          <label
            className={`flex-1 border rounded-md p-3 cursor-pointer hover:bg-gray-50 text-center transition-colors ${
              cost === "low"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="cost"
              value="low"
              checked={cost === "low"}
              onChange={(e) => setCost(e.target.value)}
              className="hidden"
            />
            <span className="font-medium">Económico</span>
          </label>

          <label
            className={`flex-1 border rounded-md p-3 cursor-pointer hover:bg-gray-50 text-center transition-colors ${
              cost === "medium"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="cost"
              value="medium"
              checked={cost === "medium"}
              onChange={(e) => setCost(e.target.value)}
              className="hidden"
            />
            <span className="font-medium">Moderado</span>
          </label>

          <label
            className={`flex-1 border rounded-md p-3 cursor-pointer hover:bg-gray-50 text-center transition-colors ${
              cost === "high"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="cost"
              value="high"
              checked={cost === "high"}
              onChange={(e) => setCost(e.target.value)}
              className="hidden"
            />
            <span className="font-medium">Premium</span>
          </label>
        </div>
      </div>

      {/* PORCIONES */}
      <div className="space-y-2">
        <h2 className="font-semibold">Número de porciones</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            type="button"
          >
            -
          </button>
          <span className="text-xl font-medium w-8 text-center">
            {servings}
          </span>
          <button
            onClick={() => setServings(Math.min(12, servings + 1))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            type="button"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
