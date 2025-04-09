import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { recipeId, userId } = await req.json();

    const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    if (!recipe) {
      return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
    }

    const imageUrl = await AIRecipeService.generateRecipeImage(
      recipe.title,
      recipe.ingredients,
      recipe.steps
    );

    recipe.imageUrl = imageUrl;
    await recipe.save();

    console.log("✅ Imagen generada y guardada para receta", recipeId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error generando imagen directamente:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
