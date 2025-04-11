"use client";

import { IRecipe } from "../lib/interfaces";
import { recipeApi, userApi } from "../lib/data";
import { useState, useEffect, useCallback, useMemo } from "react";
import RecipeCard from "../components/RecipeCard";
import {
  ChevronDownIcon,
  SparklesIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import WizardModal from "../components/WizardModal";
import { useAuth } from "../context/AuthContext";
import AsideSection from "../components/AsideSection";
import Image from "next/image";
import AdModal from "../components/AdModal";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [dietRestrictions, setDietRestrictions] = useState<string[]>([]);

  const [dailyGenerationCount, setDailyGenerationCount] = useState<number>(3);
  const [rewardedGenerations, setRewardedGenerations] = useState<number>(0);

  const imageNumber = dailyGenerationCount + rewardedGenerations;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "quick" | "favorite">(
    "all"
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "time" | "difficulty">(
    "recent"
  );

  const { user } = useAuth();

  const fetchRecipes = useCallback(() => {
    if (user && user._id) {
      setIsLoading(true);
      setError(null);
      recipeApi
        .getRecipesByAuthor(user._id)
        .then((recipes: IRecipe[]) => {
          if (Array.isArray(recipes)) {
            setRecipes(recipes);
          } else {
            console.error("La respuesta de la API no es un array:", recipes);
            setError("Error al cargar las recetas");
            setRecipes([]);
          }
        })
        .catch((error) => {
          console.error("Error al obtener recetas:", error);
          setError("Error al cargar las recetas. Por favor, intenta de nuevo.");
          setRecipes([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const fetchGenerationsStatus = useCallback(() => {
    userApi
      .getDailyStatus()
      .then((data) => {
        // data = { dailyGenerationCount, rewardedGenerations, totalDisponibles... }
        setDailyGenerationCount(data.dailyGenerationCount);
        setRewardedGenerations(data.rewardedGenerations);
      })
      .catch((error) => {
        console.error("Error al obtener estado diario:", error);
      });
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    if (user && user._id) {
      fetchGenerationsStatus();
    }
  }, [user, fetchGenerationsStatus]);

  // Al pulsar el botón flotante:
  // 1) Actualizamos el status de créditos
  // 2) Comprobamos si hay créditos
  // 3) Si hay créditos, abrimos Wizard
  //    Si NO hay créditos, abrimos modal para ver anuncio
  const handleFloatingButtonClick = async () => {
    try {
      await fetchGenerationsStatus(); // nos aseguramos de tener datos actualizados

      const totalCredits = dailyGenerationCount + rewardedGenerations;
      if (totalCredits > 0) {
        // Sí hay créditos
        setShowWizard(true);
      } else {
        // No hay créditos
        setShowAdModal(true);
      }
    } catch (error) {
      console.error("Error checking credits:", error);
    }
  };

  const closeWizard = () => setShowWizard(false);

  // Cerrar el modal de anuncio
  const closeAdModal = () => setShowAdModal(false);

  // Función para cuando terminen de ver el anuncio
  // => Llamamos al backend, sumamos +1, refrescamos estado y abrimos wizard
  const handleWatchAd = async () => {
    try {
      await userApi.watchAdReward(); // esto da +1
      await fetchGenerationsStatus(); // recargamos para ver la nueva cifra de créditos
      setShowAdModal(false); // cerramos modal de anuncio
      setShowWizard(true); // ahora sí abrimos wizard
    } catch (error) {
      console.error("Error al otorgar recompensa:", error);
    }
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (filterType) {
        case "quick":
          return recipe.cookingTime <= 30;
        case "favorite":
          return true; // TODO: Implementar sistema de favoritos
        default:
          return true;
      }
    });
  }, [recipes, searchTerm, filterType]);

  const sortedAndFilteredRecipes = useMemo(() => {
    const sorted = [...filteredRecipes];
    
    switch (sortBy) {
      case "time": {
        sorted.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      }
      case "difficulty": {
        const difficultyOrder = { basic: 0, intermediate: 1, advanced: 2 };
        sorted.sort((a, b) =>
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
        break;
      }
      case "recent":
      default: {
        sorted.sort((a, b) =>
          new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        );
      }
    }
    
    return sorted;
  }, [filteredRecipes, sortBy]);

  return (
    <main className="h-[calc(100vh-64px)] flex">
      <aside className="hidden lg:block w-64 p-4 py-6 custom-scrollbar">
        <AsideSection onRecipeSave={fetchRecipes} />
      </aside>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() =>
                    setFilterType((current) =>
                      current === "all" ? "quick" : "all"
                    )
                  }
                  className="flex items-center gap-2 text-gray-800 font-medium px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span>{filterType === "all" ? "Todas" : "Rápidas"}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                {["recent", "time", "difficulty"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option as typeof sortBy)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      sortBy === option
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option === "recent"
                      ? "Recientes"
                      : option === "time"
                      ? "Tiempo"
                      : "Dificultad"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-gray-600 text-sm">
                {sortedAndFilteredRecipes.length}{" "}
                {sortedAndFilteredRecipes.length === 1 ? "receta" : "recetas"}
              </p>
              {isSearchOpen ? (
                <div className="relative search-enter-active">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar recetas..."
                    className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Tags/Filters */}
          <div className="flex flex-wrap gap-2 px-2">
            {selectedCuisines.length > 0 &&
              selectedCuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {cuisine}
                  <button
                    onClick={() =>
                      setSelectedCuisines((prev) =>
                        prev.filter((c) => c !== cuisine)
                      )
                    }
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            {dietRestrictions.length > 0 &&
              dietRestrictions.map((diet) => (
                <span
                  key={diet}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {diet}
                  <button
                    onClick={() =>
                      setDietRestrictions((prev) =>
                        prev.filter((d) => d !== diet)
                      )
                    }
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Búsqueda: {searchTerm}
                <button onClick={() => setSearchTerm("")}>
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Grid de recetas */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <h2 className="text-2xl font-semibold">Error</h2>
            <p className="text-gray-600 text-center max-w-md">{error}</p>
            <button
              onClick={fetchRecipes}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : sortedAndFilteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <h2 className="text-2xl font-semibold">
              {searchTerm
                ? "No se encontraron recetas"
                : "Aún no tienes recetas creadas"}
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              {searchTerm
                ? `No hay resultados para "${searchTerm}". Intenta con otra búsqueda.`
                : "¿Sin ideas? Genera tu primera receta con IA y descubre nuevas creaciones culinarias."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleFloatingButtonClick}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                <SparklesIcon className="w-5 h-5" />
                Crear nueva receta
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}

        {/* Botón flotante para abrir el Wizard */}
        <button
          className="fixed bottom-8 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          onClick={handleFloatingButtonClick}
        >
          <Image
            src={`/${imageNumber}off.webp`}
            alt="Wizard"
            width={40}
            height={40}
          />
        </button>

        {showWizard && <WizardModal onClose={closeWizard} />}

        {showAdModal && (
          <AdModal onClose={closeAdModal} onWatchAd={handleWatchAd} />
        )}
      </div>
    </main>
  );
}
