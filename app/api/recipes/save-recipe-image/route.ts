import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";
import axios from "axios";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryHelper";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { recipeId, userId, imageUrl } = await req.json();

    if (!recipeId || !userId || !imageUrl) {
      return NextResponse.json(
        { error: "Faltan campos necesarios" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.findOne({ _id: recipeId, authorId: userId });
    if (!recipe) {
      return NextResponse.json(
        { error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    const uploadedUrl = await uploadToCloudinary(imageBuffer);
    recipe.imageUrl = uploadedUrl;
    await recipe.save();

    console.log("✅ Imagen guardada correctamente:", uploadedUrl);

    return NextResponse.json({ success: true, uploadedUrl });
  } catch (err) {
    console.error("❌ Error guardando imagen en receta:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
