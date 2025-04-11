"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IRecipe } from "../lib/interfaces";
import axios from "axios";
import config from "../lib/config";
import { ClockIcon } from "@heroicons/react/24/solid";

export default function RecipeCard({
  recipe: initialRecipe,
}: {
  recipe: IRecipe;
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

  return (
    <Link href={`/home/${recipe._id}`}>
      <article
        className="
        w-40
        max-h-50
        sm:w-60
        sm:max-h-75
        rounded-lg
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
        "
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
                className="w-10 h-10 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {recipe.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {recipe.cookingTime}min
            </span>
            <span className="px-1">•</span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
