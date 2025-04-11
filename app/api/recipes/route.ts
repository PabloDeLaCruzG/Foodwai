import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Recipe from "@/app/lib/models/Recipe";

export async function GET() {
  try {
    console.log("🔄 Iniciando GET /api/recipes");
    console.log("Variables de entorno:", {
      nodeEnv: process.env.NODE_ENV,
      mongoUrl: process.env.MONGODB_URL?.substring(0, 20) + "...", // Solo mostramos el inicio por seguridad
      hasOpenAI: !!process.env.OPENAI_API_KEY,
    });
    
    await connectDB();
    console.log("✅ Conexión a DB establecida");
    
    const recipes = await Recipe.find().sort({ updatedAt: -1 });
    console.log(`✅ Recetas recuperadas: ${recipes.length}`);
    
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("❌ Error detallado en /api/recipes:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        message: "Error al obtener recetas",
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
