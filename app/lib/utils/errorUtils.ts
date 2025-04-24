import { AxiosError } from "axios";

export interface ErrorResponse {
  message?: string;
  error?: string;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;
    return data?.message || data?.error || "Error de conexión con el servidor";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ha ocurrido un error inesperado";
}

export const ERROR_MESSAGES = {
  SESSION_EXPIRED:
    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  NETWORK_ERROR:
    "Error de conexión. Por favor, verifica tu conexión a internet.",
  UNAUTHORIZED: "No tienes permiso para realizar esta acción.",
  RECIPE_NOT_FOUND: "La receta no fue encontrada.",
  SERVER_ERROR: "Error en el servidor. Por favor, inténtalo más tarde.",
  VALIDATION_ERROR: "Por favor, verifica los datos ingresados.",
  AI_ERROR:
    "Error al generar la receta con IA. Por favor, inténtalo nuevamente.",
  IMAGE_ERROR: "Error al generar la imagen. Por favor, inténtalo nuevamente.",
  NO_CREDITS: "No tienes suficientes créditos para generar una receta.",
};
