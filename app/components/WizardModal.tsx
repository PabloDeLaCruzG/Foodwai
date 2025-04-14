import React, { useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import StepIndicator from "./steps/StepIndicator";
import { recipeApi } from "../lib/data";
import { GenerateRecipeBody } from "../lib/interfaces";

interface WizardModalProps {
  onClose: () => void;
}

export default function WizardModal({ onClose }: WizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Paso 1
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [dietRestrictions, setDietRestrictions] = useState<string[]>([]);
  const [extraAllergens, setExtraAllergens] = useState("");

  // Paso 2
  const [ingredientsToInclude, setIngredientsToInclude] = useState<string[]>(
    []
  );
  const [ingredientsToExclude, setIngredientsToExclude] = useState<string[]>(
    []
  );

  // Paso 3
  const [time, setTime] = useState("medium");
  const [difficulty, setDifficulty] = useState("basic");
  const [cost, setCost] = useState("low");
  const [servings, setServings] = useState(2);

  // Paso 4
  const [purpose, setPurpose] = useState("");
  const [extraDetails, setExtraDetails] = useState("");

  // Navegación con validación
  const isStepValid = () => {
    return true; // Eliminamos todas las validaciones
  };

  const goNext = () => {
    if (!isStepValid()) {
      return; // No avanzar si el paso actual no es válido
    }
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
  };

  const goBack = () => {
    setCurrentStep((prev) => {
      const back = prev - 1;
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return back;
    });
  };

  const handleGenerateRecipe = async () => {
    if (!isStepValid()) {
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    const userPreferences: GenerateRecipeBody = {
      selectedCuisines,
      dietRestrictions,
      extraAllergens,
      ingredientsToInclude,
      ingredientsToExclude,
      time,
      difficulty,
      cost,
      servings,
      purpose,
      extraDetails,
      useGemini: true, // Activando el uso de Gemini
    };

    console.log("userPreferences", userPreferences);

    try {
      const generatedRecipe = await recipeApi.generateRecipe(userPreferences);

      setShowSuccessMessage(true);

      // Llamada en segundo plano para generar la imagen
      recipeApi
        .generateImageForRecipe(generatedRecipe.recipe._id)
        .catch((err) =>
          console.error("Error generando imagen (en segundo plano):", err)
        );

      // Navegamos después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        router.push(`/home/${generatedRecipe.recipe._id}`);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al generar la receta:", error);
      setErrorMessage(
        "Hubo un error al generar la receta. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < 4;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            selectedCuisines={selectedCuisines}
            setSelectedCuisines={setSelectedCuisines}
            dietRestrictions={dietRestrictions}
            setDietRestrictions={setDietRestrictions}
          />
        );
      case 2:
        return (
          <StepTwo
            ingredientsToInclude={ingredientsToInclude}
            setIngredientsToInclude={setIngredientsToInclude}
            ingredientsToExclude={ingredientsToExclude}
            setIngredientsToExclude={setIngredientsToExclude}
            extraAllergens={extraAllergens}
            setExtraAllergens={setExtraAllergens}
          />
        );
      case 3:
        return (
          <StepThree
            time={time}
            setTime={setTime}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            cost={cost}
            setCost={setCost}
            servings={servings}
            setServings={setServings}
          />
        );
      case 4:
        return (
          <StepFour
            purpose={purpose}
            setPurpose={setPurpose}
            extraDetails={extraDetails}
            setExtraDetails={setExtraDetails}
            selectedCuisines={selectedCuisines}
            dietRestrictions={dietRestrictions}
            extraAllergens={extraAllergens}
            ingredientsToInclude={ingredientsToInclude}
            ingredientsToExclude={ingredientsToExclude}
            time={time}
            difficulty={difficulty}
            cost={cost}
            servings={servings}
          />
        );
      default:
        return null;
    }
  };

  const stepLabels = ["Cocina y dieta", "Ingredientes", "Detalles", "Resumen"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-2 sm:p-4 text-gray-900 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl relative overflow-hidden animate-slideUp">
        {/* Contenedor scrollable */}
        <div
          ref={scrollableRef}
          className="max-h-[90vh] overflow-y-auto px-3 sm:px-6 py-4 sm:py-8 custom-scrollbar"
        >
          {/* Botón de cierre */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
            disabled={isLoading} // Evita cerrar si se está cargando
            title="Cerrar wizard"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Timeline / StepIndicator */}
          <StepIndicator currentStep={currentStep} steps={stepLabels} />

          {/* Contenido del wizard */}
          <div className="mt-6 sm:mt-8 transition-opacity duration-300 ease-in-out">
            {renderStep()}
          </div>

          {/* Footer de navegación */}
          <div className="mt-6 sm:mt-8 flex justify-between pb-4">
            {canGoBack ? (
              <button
                onClick={goBack}
                className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                disabled={isLoading}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Atrás
              </button>
            ) : (
              <div />
            )}

            {canGoNext ? (
              <button
                onClick={goNext}
                className={`px-3 sm:px-4 py-2 rounded-md transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  isStepValid()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isLoading || !isStepValid()}
                title={
                  !isStepValid()
                    ? "Por favor, completa los campos requeridos para continuar"
                    : ""
                }
              >
                Siguiente
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerateRecipe}
                className={`px-3 sm:px-4 py-2 rounded-md transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  isStepValid()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={isLoading || !isStepValid()}
              >
                {isLoading ? (
                  <>
                    <span>Generando</span>
                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                  </>
                ) : (
                  <>
                    <span>Generar Receta</span>
                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* LOADER OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fadeIn">
            <div className="relative">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent text-orange-500 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-orange-500 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-center mt-4">
              Generando tu receta personalizada...
              <br />
              <span className="text-sm text-gray-500">
                Estamos creando algo especial para ti
              </span>
            </p>
            <div className="mt-4 text-sm text-gray-500 max-w-md text-center">
              <p className="animate-pulse">
                Esto puede tardar unos segundos mientras nuestra IA crea una
                receta única
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
            {errorMessage}
          </div>
        )}

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
            ¡Receta creada con éxito!
          </div>
        )}
      </div>
    </div>
  );
}
