import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";

export async function GET() {
  try {
    await connectDB();
    const recipes = await Recipe.find().sort({ updatedAt: -1 });
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    return NextResponse.json(
      { message: "Error al obtener recetas" },
      { status: 500 }
    );
  }
}
