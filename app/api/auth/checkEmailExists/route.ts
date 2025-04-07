import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    return NextResponse.json({
      exists: !!user,
      authProvider: user?.authProvider || "local",
    });
  } catch (error) {
    console.error("Error en checkEmailExists:", error);
    return NextResponse.json({ message: "Error al verificar el email" }, { status: 500 });
  }
}
