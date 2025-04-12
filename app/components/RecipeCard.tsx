"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IRecipe } from "../lib/interfaces";
import axios from "axios";
import config from "../lib/config";
import { ClockIcon, StarIcon } from "@heroicons/react/24/solid";
import { recipeApi } from "../lib/data";

export default function RecipeCard({
  recipe: initialRecipe,
  onFavoriteToggle,
}: {
  recipe: IRecipe;
  onFavoriteToggle?: (recipe: IRecipe) => void;
}) {
  const [recipe, setRecipe] = useState<IRecipe>(initialRecipe);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchUpdatedRecipe = async () => {
      try {
        const { data } = await axios.get(
          `${config.apiUrl}/api/recipes/${initialRecipe._id}`
        );
        setRecipe(data);

        if (data.imageUrl && intervalId) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error al actualizar la receta:", error);
      }
    };

    if (!initialRecipe.imageUrl) {
      intervalId = setInterval(() => {
        fetchUpdatedRecipe();
      }, 10000);
    }

    return () => clearInterval(intervalId);
  }, [initialRecipe]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación del Link
    try {
      const updatedRecipe = await recipeApi.toggleFavorite(
        recipe._id!,
        !recipe.isFavorite
      );
      setRecipe(updatedRecipe);
      if (onFavoriteToggle) {
        onFavoriteToggle(updatedRecipe);
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  return (
    <Link href={`/home/${recipe._id}`} className="block">
      <article
        className={`
        rounded-xl 
        overflow-hidden
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        transform
        hover:-translate-y-1
        bg-white
        opacity-0
        animate-[fadeIn_0.5s_ease-in-out_forwards]
        `}
      >
        <div className="relative w-full aspect-square">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
              onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <StarIcon
              className={`w-6 h-6 ${
                recipe.isFavorite ? "text-yellow-400" : "text-gray-400"
              }`}
            />
          </button>

          {recipe.difficulty && (
            <span className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-xs sm:text-sm px-2 py-1 rounded-full">
              {recipe.difficulty === "basic"
                ? "Básico"
                : recipe.difficulty === "intermediate"
                  ? "Intermedio"
                  : "Avanzado"}
            </span>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mr-1" />
            <span>{recipe.cookingTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
