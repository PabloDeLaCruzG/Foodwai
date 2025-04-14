import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";
import config from "@/app/lib/config";

export async function POST(req: Request) {
  try {
    console.log("🟢 [generate-image-now] Inicio de ejecución");

    await connectDB();
    const { recipeId, userId } = await req.json();

    const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    if (!recipe) {
      console.warn("⚠️ Receta no encontrada:", { recipeId, userId });
      return NextResponse.json(
        { error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    console.log("📋 Receta encontrada:", recipe.title);

    // Actualizamos el estado a 'generating'
    recipe.imageStatus = "generating";
    await recipe.save();

    console.log("🧠 Generando imagen con AI...");
    try {
      const imageUrl = await AIRecipeService.generateRecipeImage(
        recipe.title,
        recipe.ingredients,
        recipe.steps
      );
      console.log("🖼️ Imagen generada:", imageUrl);

      // Enviamos la imagen al worker para su procesamiento
      fetch(`${config.apiUrl}/api/recipes/generate-image-worker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId, userId, imageUrl }),
      }).catch((err) => {
        console.error(
          "❌ Error lanzando guardado de imagen en background:",
          err
        );
        recipe.imageStatus = "error";
        recipe.imageError = "Error al procesar la imagen";
        recipe.save();
      });

      return NextResponse.json({ success: true, imageUrl });
    } catch (err) {
      console.error("❌ Error generando imagen:", err);
      recipe.imageStatus = "error";
      recipe.imageError = "Error al generar la imagen";
      await recipe.save();
      return NextResponse.json(
        { error: "Error al generar la imagen" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("❌ Error general:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
