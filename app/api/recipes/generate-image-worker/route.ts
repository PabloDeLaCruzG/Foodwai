import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import axios from "axios";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryHelper";

export async function POST(req: Request) {
  try {
    console.log("🔁 [generate-image-worker] Iniciando procesamiento...");

    await connectDB();
    const { recipeId, userId, imageUrl } = await req.json();

    const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    if (!recipe) {
      console.warn("⚠️ Receta no encontrada:", { recipeId, userId });
      return NextResponse.json(
        { error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    console.log("📋 Receta encontrada:", recipe.title);
    console.log("🖼️ Usando imagen recibida:", imageUrl);

    try {
      const imageBuffer = await axios
        .get(imageUrl, { responseType: "arraybuffer" })
        .then((res) => Buffer.from(res.data, "binary"));

      const uploadedUrl = await uploadToCloudinary(imageBuffer);
      console.log("☁️ Subida a Cloudinary:", uploadedUrl);

      recipe.imageUrl = uploadedUrl;
      recipe.imageStatus = "completed";
      await recipe.save();

      console.log("✅ Imagen guardada correctamente en la receta");
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("❌ Error procesando la imagen:", err);
      recipe.imageStatus = "error";
      recipe.imageError = "Error al procesar y guardar la imagen";
      await recipe.save();
      return NextResponse.json(
        { error: "Error procesando imagen" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("❌ Error en generate-image-worker:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
