import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */

export async function POST() {
  const response = NextResponse.json({
    message: "Sesión cerrada correctamente",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Expira inmediatamente
  });

  return response;
}
