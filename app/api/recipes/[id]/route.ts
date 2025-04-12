import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const id = req.nextUrl.pathname.split("/").pop();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json(
        { message: "Receta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Error al obtener receta:", error);
    return NextResponse.json(
      { message: "Error al obtener la receta" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const id = req.nextUrl.pathname.split("/").pop();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json(
        { message: "Receta no encontrada" },
        { status: 404 }
      );
    }

    if (!recipe.authorId) {
      return NextResponse.json(
        { message: "La receta no tiene autor definido" },
        { status: 400 }
      );
    }
    if (recipe.authorId.toString() !== userId) {
      return NextResponse.json(
        { message: "No tienes permiso para eliminar esta receta" },
        { status: 403 }
      );
    }

    await recipe.deleteOne();

    return NextResponse.json(
      { message: "Receta eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar receta:", error);
    return NextResponse.json(
      { message: "Error al eliminar la receta" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const id = req.nextUrl.pathname.split("/").pop();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const { isFavorite } = await req.json();

    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, authorId: userId },
      { isFavorite },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json(
        { message: "Receta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar receta:", error);
    return NextResponse.json(
      { message: "Error al actualizar la receta" },
      { status: 500 }
    );
  }
}
