import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    console.log("🟢 [generate-image-now] Inicio de ejecución");

    // Verificar el token de autorización
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de autorización no proporcionado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
    } catch {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    await connectDB();
    const { recipeId } = await req.json();
    const userId = decoded.id;

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

      // Actualizamos la receta con la URL generada
      recipe.imageUrl = imageUrl;
      recipe.imageStatus = "completed";
      await recipe.save();

      console.log("✅ Imagen generada y guardada correctamente");
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
    console.error("❌ Error en generate-image-now:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
