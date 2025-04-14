import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import User from "@/app/lib/models/User";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";
import { resetDailyUsage } from "@/app/lib/utils/userUtils";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    console.log("🟢 Iniciando generación de receta");
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

    console.log("✅ Verificación de usuario y créditos completada");

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
      useGemini, // Nuevo parámetro
    } = bodyData;

    const cuisinesStr = selectedCuisines?.join(", ") || "no specific cuisines";
    const dietStr = dietRestrictions?.join(", ") || "no dietary restrictions";
    const includeStr = ingredientsToInclude?.join(", ") || "none";
    const excludeStr = ingredientsToExclude?.join(", ") || "none";

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
            "name": "string",
            "quantity": 100,
            "unit": "string"
          }
        ],
        "steps": [
          {
            "stepNumber": 1,
            "description": "string"
          }
        ]
      }
    `;

    console.log("📝 Prompt preparado, llamando a OpenAI");

    try {
      const recipeData = await AIRecipeService.generateRecipeFromPrompt(
        prompt,
        useGemini
      );
      console.log("✅ Receta generada por", useGemini ? "Gemini" : "OpenAI");

      const newRecipe = new Recipe({
        ...recipeData,
        imageUrl: null,
        authorId: userId,
      });

      await newRecipe.save();
      console.log("✅ Receta guardada en la base de datos");

      return NextResponse.json(
        {
          message: "Receta generada exitosamente",
          recipe: newRecipe,
        },
        { status: 201 }
      );
    } catch (aiError) {
      console.error(
        `❌ Error con ${useGemini ? "Gemini" : "OpenAI"}:`,
        aiError
      );
      return NextResponse.json(
        {
          message: `Error al generar la receta con ${useGemini ? "Gemini" : "OpenAI"}`,
          error:
            aiError instanceof Error ? aiError.message : "Error desconocido",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error general en la generación:", error);
    return NextResponse.json(
      {
        message: "Error inesperado al generar la receta",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
