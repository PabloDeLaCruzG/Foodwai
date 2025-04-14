import { GoogleGenerativeAI } from "@google/generative-ai";

export const gemini = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY_1 || ""
);

// Modelos específicos
export const geminiPro = gemini.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
