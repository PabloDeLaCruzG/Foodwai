import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
// import Recipe from "@/app/lib/models/Recipe";
import jwt from "jsonwebtoken";
// import { AIRecipeService } from "@/app/lib/services/aiRecipeService";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    console.log("🔐 Claves QStash:", {
      current: process.env.QSTASH_CURRENT_SIGNING_KEY,
      next: process.env.QSTASH_NEXT_SIGNING_KEY,
    });

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

    console.log("Enviando a QStash:", {
      recipeId,
      userId,
      endpoint: "https://foodwai.vercel.app/api/recipes/process-image",
    });

    await fetch(
      "https://qstash.upstash.io/v1/publish/aHR0cHM6Ly9mb29kd2FpLnZlcmNlbC5hcHAvYXBpL3JlY2lwZXMvcHJvY2Vzcy1pbWFnZQ==", // Base64 de la URL destino
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId,
          userId,
        }),
      }
    );

    return NextResponse.json({ message: "Imagen en proceso" }, { status: 202 });

    // const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    // if (!recipe) {
    //   return NextResponse.json(
    //     { message: "Receta no encontrada" },
    //     { status: 404 }
    //   );
    // }

    // const imageUrl = await AIRecipeService.generateRecipeImage(
    //   recipe.title,
    //   recipe.ingredients,
    //   recipe.steps
    // );

    // recipe.imageUrl = imageUrl;
    // await recipe.save();

    // return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Error encolando tarea:", error);
    return NextResponse.json(
      { message: "Error encolando imagen", error },
      { status: 500 }
    );
  }
}
