import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";
import jwt from "jsonwebtoken";
import { resetDailyUsage } from "@/app/lib/utils/userUtils";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token no encontrado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    resetDailyUsage(user);
    user.rewardedGenerations = (user.rewardedGenerations || 0) + 1;
    await user.save();

    return NextResponse.json({
      message: "Has recibido +1 generación adicional",
      dailyGenerationCount: user.dailyGenerationCount,
      rewardedGenerations: user.rewardedGenerations,
    });
  } catch (error) {
    console.error("Error en watchAdReward:", error);
    return NextResponse.json(
      { message: "Error al procesar la recompensa" },
      { status: 500 }
    );
  }
}
