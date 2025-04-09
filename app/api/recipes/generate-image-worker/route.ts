import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryHelper";
import { NextResponse } from "next/server";
import axios from "axios";

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

    const imageBuffer = await axios
      .get(imageUrl, { responseType: "arraybuffer" })
      .then((res) => Buffer.from(res.data, "binary"));

    const uploadedUrl = await uploadToCloudinary(imageBuffer);
    console.log("☁️ Subida a Cloudinary:", uploadedUrl);

    recipe.imageUrl = uploadedUrl;
    await recipe.save();

    console.log("✅ Imagen guardada correctamente en la receta");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error en generate-image-worker:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
