import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import jwt from "jsonwebtoken";
import { AIRecipeService } from "@/app/lib/services/aiRecipeService";

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

    const { recipeId } = await req.json();
    if (!recipeId) {
      return NextResponse.json({ message: "Falta recipeId" }, { status: 400 });
    }

    const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    if (!recipe) {
      return NextResponse.json(
        { message: "Receta no encontrada" },
        { status: 404 }
      );
    }

    const imageUrl = await AIRecipeService.generateRecipeImage(
      recipe.title,
      recipe.ingredients,
      recipe.steps
    );

    recipe.imageUrl = imageUrl;
    await recipe.save();

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Error generando imagen:", error);
    return NextResponse.json(
      { message: "Error generando imagen", error },
      { status: 500 }
    );
  }
}
