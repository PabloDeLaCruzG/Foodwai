import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import User from "@/app/lib/models/User";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";
import { resetDailyUsage } from "@/app/lib/utils/userUtils";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    // Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    resetDailyUsage(user);

    // Si no hay valores, inicializamos
    user.dailyGenerationCount ??= 0;
    user.rewardedGenerations ??= 0;

    let hasCredit = false;

    if (user.dailyGenerationCount > 0) {
      user.dailyGenerationCount -= 1;
      hasCredit = true;
    } else if (user.rewardedGenerations > 0) {
      user.rewardedGenerations -= 1;
      hasCredit = true;
    }

    if (!hasCredit) {
      return NextResponse.json(
        { message: "No tienes suficiente crédito" },
        { status: 403 }
      );
    }

    await user.save();

    const {
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
    } = await req.json();

    const cuisinesStr = selectedCuisines?.join(", ") || "no specific cuisines";
    const dietStr = dietRestrictions?.join(", ") || "no dietary restrictions";
    const includeStr = ingredientsToInclude?.join(", ") || "none";
    const excludeStr = ingredientsToExclude?.join(", ") || "none";

    const userLanguage =
      req.headers.get("accept-language")?.split(",")[0] || "en";

    const prompt = `
      Eres un asistente culinario. Por favor, responde estrictamente en formato JSON en ${userLanguage}.
      Genera una receta que cumpla con los siguientes parámetros:

      Tipos de cocina: ${cuisinesStr}.
      Restricciones dietéticas: ${dietStr}.
      Alérgenos adicionales: ${extraAllergens || "ninguno"}.
      Ingredientes a incluir: ${includeStr}.
      Ingredientes a excluir: ${excludeStr}.
      Preferencia de tiempo de preparación: ${time}.
      Nivel de dificultad: ${difficulty}.
      Nivel de coste: ${cost}.
      Raciones: ${servings}.
      Propósito: ${purpose || "general"}.
      Detalles extra: ${extraDetails || "ninguno"}.

      Genera una receta que cumpla con estos criterios.

      Devuelve un JSON ESTRICTAMENTE válido con la siguiente estructura:
        {
        "title": "string",
        "description": "string",
        "cookingTime": 30,
        "difficulty": "string",
        "costLevel": "string",
        "cuisine": "string",
        "nutritionalInfo": {
          "calories": 300,
          "protein": 20,
          "fat": 10,
          "carbs": 50
        },
        "ingredients": [
          {
            "name": "Ingrediente 1",
            "quantity": 100,
            "unit": "g"
          }
        ],
        "steps": [
          {
            "stepNumber": 1,
            "description": "Descripción detallada del paso"
          }
        ]
      }

      No incluyas texto adicional, corchetes o llaves extra o faltantes.
      No uses valores de texto para "quantity".
      Si un ingrediente se usa “al gusto”, establece "quantity" en 1 y "unit" en "al gusto".
      No dejes el campo "unit" vacío.
    `;

    const recipeData = await AIRecipeService.generateRecipeFromPrompt(prompt);

    // const imageUrl = await AIRecipeService.generateRecipeImage(
    //   recipeData.title,
    //   recipeData.ingredients,
    //   recipeData.steps
    // );

    const imageUrl = null; // La imagen se generará por separado en otro endpoint

    const newRecipe = new Recipe({
      ...recipeData,
      imageUrl,
      authorId: userId,
    });

    await newRecipe.save();

    return NextResponse.json(
      { message: "Receta generada exitosamente", recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al generar la receta:", error);
    return NextResponse.json(
      { message: "Error al generar la receta", error: error },
      { status: 500 }
    );
  }
}
