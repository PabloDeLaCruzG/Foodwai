import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔄 Iniciando conexión a MongoDB...");
    const uri = process.env.MONGODB_URL;

    if (!uri) {
      console.error("❌ MONGODB_URL no está definida en el entorno");
      throw new Error("MONGODB_URL no está definida");
    }

    if (mongoose.connection.readyState === 1) {
      console.log("✅ Ya existe una conexión activa a MongoDB");
      return;
    }

    await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado exitosamente en ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
};
