"use client";

import { IRecipe } from "../lib/interfaces";
import { recipeApi, userApi } from "../lib/data";
import { useState, useEffect, useCallback, useMemo } from "react";
import RecipeCard from "../components/RecipeCard";
import { SparklesIcon } from "@heroicons/react/24/solid";
import WizardModal from "../components/WizardModal";
import { useAuth } from "../context/AuthContext";
//import AsideSection from "../components/AsideSection";
import Image from "next/image";
import AdModal from "../components/AdModal";
import FilterTabs from "../components/filters/FilterTabs";
import SearchBar from "../components/filters/SearchBar";
import SortBy from "../components/filters/SortBy";
import AdSenseDisplay from "../components/AdSenseDisplay";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  const [dailyGenerationCount, setDailyGenerationCount] = useState<number>(3);
  const [rewardedGenerations, setRewardedGenerations] = useState<number>(0);

  const imageNumber = dailyGenerationCount + rewardedGenerations;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "favorite">("all");
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

  const handleFavoriteToggle = (updatedRecipe: IRecipe) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      )
    );
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === "favorite") {
        return recipe.isFavorite;
      }

      return true;
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
        sorted.sort(
          (a, b) =>
            difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
            difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
        break;
      }
      case "recent":
      default: {
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
      }
    }

    return sorted;
  }, [filteredRecipes, sortBy]);

  return (
    <main className="h-[calc(100vh-64px)] flex">
      {/* <aside className="hidden lg:block w-64 p-4 py-6 custom-scrollbar">
        <AsideSection onRecipeSave={fetchRecipes} />
      </aside> */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {/* Barra de filtros */}
          <div className="mb-6 border-b border-gray-100 pb-4 pt-2">
            <div className="flex items-center justify-between gap-2 min-w-0">
              {/* Ordenación - Izquierda */}
              <div className="shrink-0">
                <SortBy sortBy={sortBy} setSortBy={setSortBy} />
              </div>

              {/* Filtros Todas/Favoritas - Centro */}
              <div className="flex-1 flex justify-center min-w-0">
                <FilterTabs
                  filterType={filterType}
                  setFilterType={setFilterType}
                />
              </div>

              {/* Buscador - Derecha */}
              <div className="shrink-0">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
            </div>
          </div>

          {/* Grid de recetas */}
          {isLoading ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="flex flex-col items-center justify-center min-h-[400px] px-4 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-center">
                Error
              </h2>
              <p className="text-gray-600 text-center max-w-md text-sm sm:text-base">
                {error}
              </p>
              <button
                onClick={fetchRecipes}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : sortedAndFilteredRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] px-4 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-center">
                {searchTerm
                  ? "No se encontraron recetas"
                  : filterType === "favorite"
                    ? "No tienes recetas favoritas"
                    : "Aún no tienes recetas creadas"}
              </h2>
              <p className="text-gray-600 text-center max-w-md text-sm sm:text-base">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}". Intenta con otra búsqueda.`
                  : filterType === "favorite"
                    ? "Marca algunas recetas como favoritas para verlas aquí"
                    : "¿Sin ideas? Genera tu primera receta con IA y descubre nuevas creaciones culinarias."}
              </p>
              {!searchTerm && filterType !== "favorite" && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
              {sortedAndFilteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}

          {/* Anuncio después del grid de recetas */}
          <div className="mt-8 flex justify-center">
            <AdSenseDisplay slot="5678901234" />
          </div>

          {/* Botón flotante */}
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
      </div>
    </main>
  );
}
