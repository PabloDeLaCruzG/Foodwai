"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
//import Image from "next/image";
import {
  ArrowLongLeftIcon,
  ClockIcon,
  BanknotesIcon,
  UserIcon,
  FireIcon,
  BeakerIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { IRecipe } from "../../lib/interfaces"; // Ajusta la ruta según tu proyecto
import { recipeApi } from "../../lib/data"; // Ajusta según tu API
import SquareBar from "@/app/components/SquareBar";
import AdSenseDisplay from "@/app/components/AdSenseDisplay";

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con imagen de fondo */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {recipe.imageUrl ? (
          <>
            <div className="absolute inset-0">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-orange-600 animate-pulse" />
        )}

        {/* Contenido del Hero */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 max-w-7xl mx-auto">
          <Link
            href="/home"
            className="inline-flex items-center text-white mb-6 hover:text-orange-200 transition-colors"
          >
            <ArrowLongLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">Volver</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {recipe.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mb-6">
            {recipe.description}
          </p>

          {/* Stats rápidos */}
          <div className="flex flex-wrap gap-4 text-white/90 mb-8">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5" />
              <span>{recipe.costLevel}</span>
            </div>
          </div>
        </div>

        {/* Estados de generación de imagen */}
        {!recipe.imageUrl && recipe.imageStatus === "pending" && (
          <div className="absolute top-4 left-4 right-4 flex justify-center">
            <span className="bg-yellow-400 text-white text-sm px-6 py-2 rounded-full shadow-lg">
              Esperando generación de imagen...
            </span>
          </div>
        )}
        {recipe.imageStatus === "generating" && (
          <div className="absolute top-4 left-4 right-4 flex justify-center">
            <span className="bg-orange-500 text-white text-sm px-6 py-2 rounded-full shadow-lg animate-pulse">
              Generando imagen...
            </span>
          </div>
        )}
        {recipe.imageStatus === "error" && (
          <div className="absolute top-4 left-4 right-4 flex justify-center">
            <div className="bg-red-500 text-white text-sm px-6 py-2 rounded-full shadow-lg flex items-center gap-4">
              <span>{recipe.imageError || "Error al generar la imagen"}</span>
              <button
                onClick={handleRetryGenerateImage}
                className="bg-white text-red-500 px-4 py-1 rounded-full text-sm hover:bg-red-50 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-12">
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {/* Info Nutricional */}
          <div className="bg-white rounded-2xl shadow-xl p-6 order-2 md:order-1">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <ChartBarIcon className="w-6 h-6 text-orange-500" />
              Información Nutricional
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FireIcon className="w-5 h-5 text-orange-400" />
                    Calorías
                  </span>
                  <span className="font-bold text-gray-900">
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Proteína</span>
                  <span className="font-bold text-gray-900">
                    {recipe.nutritionalInfo.protein}g
                  </span>
                </div>
                <SquareBar
                  filled={getFilledSquares(
                    recipe.nutritionalInfo.protein,
                    "protein"
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Carbohidratos</span>
                  <span className="font-bold text-gray-900">
                    {recipe.nutritionalInfo.carbs}g
                  </span>
                </div>
                <SquareBar
                  filled={getFilledSquares(
                    recipe.nutritionalInfo.carbs,
                    "carbs"
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Grasas</span>
                  <span className="font-bold text-gray-900">
                    {recipe.nutritionalInfo.fat}g
                  </span>
                </div>
                <SquareBar
                  filled={getFilledSquares(recipe.nutritionalInfo.fat, "fat")}
                />
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="bg-white rounded-2xl shadow-xl p-6 col-span-2 order-1 md:order-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <BeakerIcon className="w-6 h-6 text-orange-500" />
              Ingredientes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recipe.ingredients.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-orange-600 font-medium block">
                      {item.unit}
                    </span>
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anuncio entre ingredientes y pasos */}
        <div className="my-8 flex justify-center">
          <AdSenseDisplay slot="6789012345" />
        </div>

        {/* Pasos de preparación */}
        <section className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-8 text-gray-900">Preparación</h2>
          <div className="space-y-8">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-none">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                    {step.stepNumber}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
