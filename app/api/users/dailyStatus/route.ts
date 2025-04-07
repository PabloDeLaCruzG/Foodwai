import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";
import jwt from "jsonwebtoken";
import { resetDailyUsage } from "@/app/lib/utils/userUtils";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET() {
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
    await user.save();

    const totalDisponibles =
      (user.dailyGenerationCount || 0) + (user.rewardedGenerations || 0);

    return NextResponse.json({
      dailyGenerationCount: user.dailyGenerationCount,
      rewardedGenerations: user.rewardedGenerations,
      totalDisponibles,
      lastGenerationDate: user.lastGenerationDate,
    });
  } catch (error) {
    console.error("Error en getDailyStatus:", error);
    return NextResponse.json(
      { message: "Error al obtener estado diario" },
      { status: 500 }
    );
  }
}
