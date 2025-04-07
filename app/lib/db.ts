import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error("⚠️ MONGODB_URL no está definida en el entorno");
    }

    const connection = await mongoose.connect(uri);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB connected to ${url}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
