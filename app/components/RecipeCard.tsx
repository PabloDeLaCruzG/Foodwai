"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IRecipe } from "../lib/interfaces";
import axios from "axios";

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
        const { data } = await axios.get(`/api/recipes/${initialRecipe._id}`);
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
        hover:shadow-md
        cursor-pointer
        overflow-hidden
        transition-shadow
        flex flex-col
        line-clamp-2
      "
      >
        <div className="relative w-full h-40 sm:h-48 md:h-52">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title || "Imagen de la receta"}
              className="object-cover rounded-xl transition-opacity duration-700 opacity-0"
              onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-xl animate-pulse" />
          )}
          {!recipe.imageUrl && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded shadow">
              Generando imagen...
            </span>
          )}
        </div>

        <div className="p-2 flex flex-col flex-1">
          <h1 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-3">
            {recipe.title}
          </h1>
          <p className="text-xs sm:text-sm text-orange-300 mt-1">
            {recipe.cuisine}, {recipe.cookingTime} min
          </p>
        </div>
      </article>
    </Link>
  );
}
