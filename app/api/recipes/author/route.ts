import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import User from "@/app/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const recipes = await Recipe.find({ authorId: userId }).sort({
      updatedAt: -1,
    });

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error al obtener recetas del autor:", error);
    return NextResponse.json(
      { message: "Error al obtener recetas del autor" },
      { status: 500 }
    );
  }
}
