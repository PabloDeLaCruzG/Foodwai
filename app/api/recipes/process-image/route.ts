import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";

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

    // Llamada interna no bloqueante para generar imagen
    fetch("https://foodwai.onrender.com/api/recipes/generate-image-now", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId, userId }),
    }).catch((err) =>
      console.error("❌ Error lanzando generación en background:", err)
    );

    console.log("✅ Generación delegada correctamente a /generate-image-now");

    return NextResponse.json({ enqueued: true });
  } catch (err) {
    console.error("Error procesando imagen:", err);
    return NextResponse.json(
      { error: "Error generando imagen" },
      { status: 500 }
    );
  }
});
