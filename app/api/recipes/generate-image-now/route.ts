import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import User from "@/app/lib/models/User";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * @openapi
 * /api/recipes/generate-image-now:
 *   post:
 *     summary: Genera una imagen para una receta existente
 *     tags:
 *       - Recetas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: ID de la receta
 *     responses:
 *       200:
 *         description: Imagen generada correctamente
 *       400:
 *         description: Token no proporcionado o ID inválido
 *       401:
 *         description: Usuario no autenticado
 *       404:
 *         description: Receta o usuario no encontrado
 */

export async function POST(req: NextRequest) {
  try {
    console.log("🟢 [generate-image-now] Inicio de ejecución");
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

    const { recipeId } = await req.json();

    // Validar que recipeId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json(
        { error: "ID de receta inválido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 }
      );
    }

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
    return NextResponse.json(
      { error: "Error en el servidor al procesar la solicitud" },
      { status: 500 }
    );
  }
}
