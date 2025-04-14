"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
//import Image from "next/image";
import {
  ArrowLongLeftIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { IRecipe } from "../../lib/interfaces"; // Ajusta la ruta según tu proyecto
import { recipeApi } from "../../lib/data"; // Ajusta según tu API
import SquareBar from "@/app/components/SquareBar";

// Rango de ejemplo para calcular las barras (o cuadrados) de nutrientes
const NUTRIENT_RANGES = {
  calories: { min: 100, max: 600 },
  protein: { min: 10, max: 50 },
  carbs: { min: 10, max: 50 },
  fat: { min: 5, max: 30 },
};

function getFilledSquares(
  value: number,
  nutrient: keyof typeof NUTRIENT_RANGES
) {
  const { min, max } = NUTRIENT_RANGES[nutrient];
  // Se mapean 5 cuadrados en total
  return Math.round(((value - min) / (max - min)) * 4) + 1;
}

export default function RecipeDetailsPage() {
  const { id }: { id: IRecipe["_id"] } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);

  // Traer la receta del API
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRecipe = async () => {
      try {
        const data = await recipeApi.getRecipeById(id!);
        setRecipe(data);

        // Detener el polling si:
        // 1. La imagen está lista
        // 2. Hay un error en la generación
        // 3. El estado es 'completed'
        if (
          data.imageUrl ||
          data.imageStatus === "error" ||
          data.imageStatus === "completed"
        ) {
          clearInterval(intervalId);
        }
      } catch (error: unknown) {
        console.error("Error fetching recipe:", error as Error);
        clearInterval(intervalId); // También detenemos el polling si hay un error en la petición
      }
    };

    if (id) {
      fetchRecipe();

      // Iniciar polling solo si no hay imagen y no hay error
      if (!recipe?.imageUrl && recipe?.imageStatus !== "error") {
        intervalId = setInterval(() => {
          fetchRecipe();
        }, 10000); // Polling cada 10 segundos
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, recipe?.imageUrl, recipe?.imageStatus]);

  const handleRetryGenerateImage = async () => {
    if (!recipe?._id) return;

    try {
      await recipeApi.generateImageForRecipe(recipe._id);
      // Reiniciar el polling
      setRecipe((prev) =>
        prev
          ? {
              ...prev,
              imageStatus: "pending",
              imageError: undefined,
            }
          : null
      );
    } catch (error) {
      console.error("Error al reintentar la generación de imagen:", error);
    }
  };

  if (!recipe) {
    return (
      <div className="text-black p-4">
        <p>Cargando la receta...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 text-gray-800">
      {/* Botón Volver */}
      <div className="flex items-center mb-4 sm:mb-6">
        <Link
          href="/home"
          className="inline-flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLongLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
          <span className="text-sm sm:text-base font-medium">Volver</span>
        </Link>
      </div>

      {/* Encabezado / Imagen principal */}
      <header className="relative w-full h-48 sm:h-64 mb-4 sm:mb-6">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-lg sm:rounded-xl shadow-md opacity-0 transition-opacity duration-700"
            onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg sm:rounded-xl animate-pulse" />
        )}
        {!recipe.imageUrl && recipe.imageStatus === "pending" && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded shadow">
            Esperando generación de imagen...
          </span>
        )}
        {recipe.imageStatus === "generating" && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow animate-pulse">
            Generando imagen...
          </span>
        )}
        {recipe.imageStatus === "error" && (
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between bg-red-500 text-white text-xs px-2 py-1 rounded shadow">
            <span>{recipe.imageError || "Error al generar la imagen"}</span>
            <button
              onClick={handleRetryGenerateImage}
              className="ml-2 bg-white text-red-500 px-2 py-0.5 rounded text-xs hover:bg-red-50 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </header>

      {/* Título y descripción */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {recipe.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {recipe.description}
        </p>
      </div>

      <main>
        {/* GRID con Info General + Info Nutricional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Sección Info General */}
          <section className="col-span-1 md:col-span-2 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
                <span className="font-semibold text-sm sm:text-base">
                  Tiempo
                </span>
              </div>
              <p className="text-sm sm:text-base">{recipe.cookingTime} min</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold text-sm sm:text-base">
                  Dificultad
                </span>
              </div>
              <p className="text-sm sm:text-base">{recipe.difficulty}</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <BanknotesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
                <span className="font-semibold text-sm sm:text-base">
                  Coste
                </span>
              </div>
              <p className="text-sm sm:text-base">{recipe.costLevel}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold text-sm sm:text-base">
                  Cocina
                </span>
              </div>
              <p className="text-sm sm:text-base">{recipe.cuisine}</p>
            </div>
          </section>
          {/* Sección Información Nutricional */}
          <aside className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Información Nutricional
            </h2>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Calorías</span>
                <span className="font-bold">
                  {recipe.nutritionalInfo.calories} Kcal
                </span>
              </div>
              <SquareBar
                filled={getFilledSquares(
                  recipe.nutritionalInfo.calories,
                  "calories"
                )}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Proteína</span>
                <span className="font-bold">
                  {recipe.nutritionalInfo.protein} g
                </span>
              </div>
              <SquareBar
                filled={getFilledSquares(
                  recipe.nutritionalInfo.protein,
                  "protein"
                )}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Carbohidratos</span>
                <span className="font-bold">
                  {recipe.nutritionalInfo.carbs} g
                </span>
              </div>
              <SquareBar
                filled={getFilledSquares(recipe.nutritionalInfo.carbs, "carbs")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Grasas</span>
                <span className="font-bold">
                  {recipe.nutritionalInfo.fat} g
                </span>
              </div>
              <SquareBar
                filled={getFilledSquares(recipe.nutritionalInfo.fat, "fat")}
              />
            </div>
          </aside>
        </div>

        {/* Sección de Ingredientes - estilo “tarjetado” en grid */}
        <section className="bg-white p-3 sm:p-4 mt-4 sm:mt-6 rounded-lg sm:rounded-xl shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
            Ingredientes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {recipe.ingredients.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg shadow-sm"
              >
                <span className="text-sm font-semibold text-orange-500">
                  {item.quantity} {item.unit}
                </span>
                <span className="text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Pasos - estilo “timeline” */}
        <section className="bg-white p-3 sm:p-4 mt-4 sm:mt-6 rounded-lg sm:rounded-xl shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
            Preparación
          </h2>

          {/* Contenedor con una línea a la izquierda simulando un timeline */}
          <div className="relative border-l-4 border-orange-300 pl-4 sm:pl-6">
            {recipe.steps.map((step, index) => (
              <div key={index} className="mb-6 relative">
                {/* Pequeño círculo para cada paso */}
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-300 rounded-full absolute -left-2 sm:-left-2.5 top-1" />
                <h3 className="font-semibold mb-1 ml-2 sm:ml-4 text-sm sm:text-base">
                  Paso {step.stepNumber}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
