import { GoogleGenerativeAI } from "@google/generative-ai";

// Array de API keys
const API_KEYS = [
  process.env.GEMINI_API_KEY_1 || "",
  process.env.GEMINI_API_KEY_2 || "",
].filter((key) => key !== ""); // Filtrar keys vacías

let currentKeyIndex = 0;

// Función para obtener la siguiente API key en rotación
const getNextApiKey = () => {
  const key = API_KEYS[currentKeyIndex];
  // Rotamos siempre al siguiente índice
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
};

// Función para obtener una nueva instancia de Gemini con la siguiente API key
export const getGeminiInstance = () => {
  const key = getNextApiKey();
  return { instance: new GoogleGenerativeAI(key), key };
};

// Función para obtener modelos con la API key rotada
export const getGeminiModels = () => {
  const { instance: gemini, key } = getGeminiInstance();
  return {
    geminiPro: gemini.getGenerativeModel({ model: "gemini-2.0-flash-lite" }),
    geminiProVision: gemini.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
    }),
    currentKey: key,
  };
};
