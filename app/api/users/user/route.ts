import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";
import jwt from "jsonwebtoken";

/**
 * @openapi
 * /api/users/user:
 *   get:
 *     summary: Obtiene la información del usuario autenticado
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Información del usuario obtenida correctamente
 *       401:
 *         description: Token no encontrado o usuario no autenticado
 *       404:
 *         description: Usuario no encontrado
 */

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "No se encontró el token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error en getCurrentUser:", error);
    return NextResponse.json(
      { message: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}
