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

    const bodyData = await req.json();
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
    } = bodyData;

    const cuisinesStr = selectedCuisines?.join(", ") || "no specific cuisines";
    const dietStr = dietRestrictions?.join(", ") || "no dietary restrictions";
    const includeStr = ingredientsToInclude?.join(", ") || "none";
    const excludeStr = ingredientsToExclude?.join(", ") || "none";

    // Construimos el prompt de forma concisa
    const prompt = `
      Genera una receta que cumpla con los siguientes parámetros:
      Tipos de cocina: ${cuisinesStr}
      Restricciones dietéticas: ${dietStr}
      Alérgenos adicionales: ${extraAllergens || "ninguno"}
      Ingredientes a incluir: ${includeStr}
      Ingredientes a excluir: ${excludeStr}
      Preferencia de tiempo de preparación: ${time}
      Nivel de dificultad: ${difficulty}
      Nivel de coste: ${cost}
      Raciones: ${servings}
      Propósito: ${purpose || "general"}
      Detalles extra: ${extraDetails || "ninguno"}

      Devuelve JSON válido siguiendo el esquema indicado.
    `;

    console.log("PROMPT ENVIADO A OPENAI:", prompt);

    // Generar la receta
    const recipeData = await AIRecipeService.generateRecipeFromPrompt(prompt);

    console.log("RECETA:", recipeData);

    // Guardar receta
    const newRecipe = new Recipe({
      ...recipeData,
      imageUrl: null, // la imagen se genera en otro endpoint
      authorId: userId,
    });

    await newRecipe.save();

    return NextResponse.json(
      {
        message: "Receta generada exitosamente",
        recipe: newRecipe,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error en el endpoint /api/recipes/generate:", error);

    // Si es error de axios con response
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as Record<string, unknown>).response === "object"
    ) {
      const responseData = (error as { response: { data: unknown } }).response
        .data;
      console.error("Respuesta del modelo:", responseData);
      return NextResponse.json(
        {
          message: "Error en el servicio de generación",
          details: responseData,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message: "Error inesperado al generar la receta",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
