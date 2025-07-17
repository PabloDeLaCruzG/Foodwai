import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";

/**
 * @openapi
 * /api/auth/checkEmailExists:
 *   post:
 *     summary: Verifica si un email ya está registrado
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *     responses:
 *       200:
 *         description: Respuesta con existencia del email
 *       400:
 *         description: Email es requerido
 *       500:
 *         description: Error interno
 */

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    return NextResponse.json({
      exists: !!user,
      authProvider: user?.authProvider || "local",
    });
  } catch (error) {
    console.error("Error en checkEmailExists:", error);
    return NextResponse.json(
      { message: "Error al verificar el email" },
      { status: 500 }
    );
  }
}
