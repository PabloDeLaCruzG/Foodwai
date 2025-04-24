import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User"; // ajusta si tienes /models directamente en lib
import bcrypt from "bcryptjs";

const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "La contraseña debe tener al menos 8 caracteres",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "La contraseña debe contener al menos una mayúscula",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "La contraseña debe contener al menos una minúscula",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "La contraseña debe contener al menos un número",
    };
  }
  return { isValid: true, message: "" };
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    // Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Validar la contraseña
    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Usuario ya existe" }, { status: 400 });
    }

    // Usar un factor de costo más alto para bcrypt (12-14 es recomendado para producción)
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email, password: hashedPassword });

    // Simulamos un token de sesión (puedes usar JWT luego)
    const token = `mock-token-${newUser._id}`;

    const response = NextResponse.json({
      message: "Usuario registrado",
      user: newUser,
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
    });

    return response;
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
