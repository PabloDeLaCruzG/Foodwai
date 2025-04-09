import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";

export const POST = verifySignatureAppRouter(async (req: Request) => {
  console.log("📩 QStash ha llamado a /api/recipes/process-image");

  try {
    await connectDB();
    console.log("Conectado a MongoDB");

    const { recipeId, userId } = await req.json();

    const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    if (!recipe) {
      return NextResponse.json(
        { error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    console.log("Receta encontrada:", recipe);

    const imageUrl = await AIRecipeService.generateRecipeImage(
      recipe.title,
      recipe.ingredients,
      recipe.steps
    );

    console.log("Imagen generada:", imageUrl);

    recipe.imageUrl = imageUrl;
    await recipe.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error procesando imagen:", err);
    return NextResponse.json(
      { error: "Error generando imagen" },
      { status: 500 }
    );
  }
});
