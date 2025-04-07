import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import User from "@/app/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    // Verificamos el token
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
