import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { Client } from "@upstash/qstash";
import config from "@/app/lib/config";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const userId = decoded.id;

    const { recipeId } = await req.json();
    if (!recipeId) {
      return NextResponse.json({ message: "Falta recipeId" }, { status: 400 });
    }

    const qstash = new Client({
      token: process.env.QSTASH_TOKEN!,
    });

    await qstash.publishJSON({
      url: `${config.apiUrl}/api/recipes/process-image`,
      body: {
        recipeId,
        userId,
      },
    });

    return NextResponse.json({ message: "Imagen en proceso" }, { status: 202 });
  } catch (error) {
    console.error("Error encolando tarea:", error);
    return NextResponse.json(
      { message: "Error encolando imagen", error },
      { status: 500 }
    );
  }
}
