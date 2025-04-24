"use client";

import { useState } from "react";
import { authApi } from "../lib/data";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { FaSpinner } from "react-icons/fa";
import { getErrorMessage } from "../lib/utils/errorUtils";
import ErrorMessage from "./ErrorMessage";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"initial" | "password">("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (
    pass: string
  ): { isValid: boolean; message: string } => {
    if (pass.length < 8) {
      return {
        isValid: false,
        message: "La contraseña debe tener al menos 8 caracteres",
      };
    }
    if (!/[A-Z]/.test(pass)) {
      return {
        isValid: false,
        message: "La contraseña debe contener al menos una mayúscula",
      };
    }
    if (!/[a-z]/.test(pass)) {
      return {
        isValid: false,
        message: "La contraseña debe contener al menos una minúscula",
      };
    }
    if (!/[0-9]/.test(pass)) {
      return {
        isValid: false,
        message: "La contraseña debe contener al menos un número",
      };
    }
    return { isValid: true, message: "" };
  };

  const router = useRouter();

  const handleGoogleAuth = async (idToken: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await authApi.googleAuth(idToken);
      router.push("/home");
    } catch (error) {
      console.error("Error en autenticación con Google", error);
      setErrorMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = async () => {
    if (!email) {
      setErrorMsg("Por favor, ingresa tu correo electrónico");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Por favor, ingresa un correo electrónico válido");
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await authApi.checkEmailExists(email);

      if (res.exists) {
        if (res.authProvider === "google") {
          setErrorMsg(
            "Esta cuenta está registrada con Google. Inicia sesión con Google."
          );
          return;
        } else {
          setMode("login");
        }
      } else {
        setMode("register");
      }
      setStep("password");
    } catch (error) {
      console.error("Error verificando el email:", error);
      setErrorMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Por favor, completa todos los campos");
      return;
    }

    if (mode === "register") {
      const { isValid, message } = validatePassword(password);
      if (!isValid) {
        setErrorMsg(message);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await authApi.loginUser({ email, password });
      } else {
        await authApi.registerUser({ email, password });
      }
      router.push("/home");
    } catch (error) {
      console.error(
        mode === "login" ? "Error en login:" : "Error en registro:",
        error
      );
      setErrorMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {mode === "login" ? "Iniciar Sesión" : "Bienvenido a Foodia"}
      </h2>

      {mode === "register" && (
        <p className="text-sm text-gray-600 text-center mb-4">
          Crea tu cuenta para comenzar a disfrutar de infinitas recetas.
        </p>
      )}
      <div className="w-full flex items-center justify-center gap-2 mb-2">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const idToken = credentialResponse.credential;
            if (idToken) {
              handleGoogleAuth(idToken);
            }
          }}
          onError={() => {
            console.error("Error en login de Google");
          }}
        />
      </div>

      <div className="flex text-center items-center my-4 w-full">
        <hr className="w-full border-gray-300" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="w-full border-gray-300" />
      </div>

      {errorMsg && (
        <ErrorMessage
          message={errorMsg}
          className="w-full mb-4 animate-slideIn"
        />
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="email" className="block text-gray-600 text-sm mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (step === "initial" && e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="border text-gray-900 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
          disabled={step === "password" || loading}
        />
        {errorMsg && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}

        {step === "initial" && (
          <button
            type="button"
            onClick={checkEmail}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition mt-4 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Next"}
          </button>
        )}

        {step === "password" && (
          <>
            <div className="relative w-full mt-3">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm mb-1"
              >
                Password
              </label>
              {mode === "login" && (
                <a
                  href="#"
                  className="absolute right-0 top-0 text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              )}
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border text-gray-900 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition mb-3"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition mt-4 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : mode === "login" ? (
                "Iniciar Sesión"
              ) : (
                "Registrarse"
              )}
            </button>
          </>
        )}
      </form>

      <button
        onClick={() => {
          setMode("login");
          setStep("initial");
          setErrorMsg(null);
          setEmail("");
          setPassword("");
        }}
        className="text-sm text-gray-500 mt-4 hover:underline"
        disabled={loading}
      >
        {mode === "register" ? "¿Ya tienes cuenta? Inicia sesión" : ""}
      </button>
    </div>
  );
}
