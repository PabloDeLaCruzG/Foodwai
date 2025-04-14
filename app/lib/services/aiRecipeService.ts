import { openai } from "../openai";
import { getGeminiModels } from "../gemini";
import { AIRecipeData } from "../interfaces";
// import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryHelper";
// import axios from "axios";

export class AIRecipeService {
  static async generateRecipeFromPrompt(
    prompt: string,
    useGemini: boolean = false
  ): Promise<AIRecipeData> {
    if (useGemini) {
      return this.generateRecipeWithGemini(prompt);
    }
    return this.generateRecipeWithOpenAI(prompt);
  }

  private static async generateRecipeWithOpenAI(
    prompt: string
  ): Promise<AIRecipeData> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content:
              "Responde exclusivamente con JSON válido sin comentarios, sin explicaciones, sin etiquetas ni backticks.",
          },
          {
            role: "user",
            content: `Idioma: es. ${prompt}`,
          },
        ],
        temperature: 0.5,
      });

      const aiResult = response.choices[0]?.message?.content?.trim();
      if (!aiResult) {
        throw new Error("La API de OpenAI no devolvió resultado");
      }

      let cleanedResponse = aiResult.replace(/```/g, "").trim();
      const match = cleanedResponse.match(/\{[\s\S]*\}/);
      if (match) {
        cleanedResponse = match[0];
      }

      const recipeData: AIRecipeData = JSON.parse(cleanedResponse);

      if (
        !recipeData.steps ||
        !Array.isArray(recipeData.steps) ||
        !recipeData.steps.length
      ) {
        throw new Error(
          "La respuesta no contiene pasos de elaboración o su formato es inválido."
        );
      }

      return recipeData;
    } catch (error) {
      console.error("Error al generar receta con OpenAI:", error);
      throw error;
    }
  }

  private static async generateRecipeWithGemini(
    prompt: string
  ): Promise<AIRecipeData> {
    console.log("📝 Prompt preparado, llamando a Gemini");

    try {
      const { geminiPro } = getGeminiModels();

      const result = await geminiPro.generateContent([
        "Debes responder ÚNICAMENTE con JSON válido, sin comentarios ni explicaciones adicionales. " +
          "El JSON debe contener una receta con title, description, cookingTime, difficulty, costLevel, " +
          "cuisine, nutritionalInfo (con calories, protein, fat, carbs), ingredients (array con name, " +
          "quantity, unit), y steps (array con stepNumber y description). Idioma: es. " +
          prompt,
      ]);

      const response = await result.response;
      console.log("Response Gemini", response);
      const text = response.text();

      // Extraer el JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se encontró JSON válido en la respuesta de Gemini");
      }

      const recipeData: AIRecipeData = JSON.parse(jsonMatch[0]);

      if (
        !recipeData.steps ||
        !Array.isArray(recipeData.steps) ||
        !recipeData.steps.length
      ) {
        throw new Error(
          "La respuesta no contiene pasos de elaboración o su formato es inválido."
        );
      }

      return recipeData;
    } catch (error) {
      console.error("Error al generar receta con Gemini:", error);
      throw error;
    }
  }

  // Mantenemos el método principal de generación de imágenes
  static async generateRecipeImage(
    recipeTitle: string,
    ingredients: { name: string }[],
    steps: { description: string }[]
  ): Promise<string> {
    try {
      // Intentamos primero con Gemini
      try {
        const geminiImageUrl = await this.generateRecipeImageWithGemini(
          recipeTitle,
          ingredients,
          steps
        );
        return geminiImageUrl;
      } catch (geminiError) {
        console.log(
          "Error con Gemini, usando OpenAI como respaldo:",
          geminiError
        );
        // Si falla Gemini, usamos OpenAI como respaldo
        return this.generateRecipeImageWithOpenAI(
          recipeTitle,
          ingredients,
          steps
        );
      }
    } catch (error) {
      console.error("Error al generar imagen:", error);
      throw error;
    }
  }

  private static async generateRecipeImageWithGemini(
    recipeTitle: string,
    ingredients: { name: string }[],
    steps: { description: string }[]
  ): Promise<string> {
    const ingString = ingredients.map((i) => i.name).join(", ");
    const stepsString = steps.map((s) => s.description).join(". ");

    const prompt = `Foto realista y profesional del plato: ${recipeTitle}, que lleva: ${ingString}. Elaboración: ${stepsString}. Fondo neutro, buena iluminación.`;

    try {
      const { geminiProVision } = getGeminiModels();
      const result = await geminiProVision.generateContent(prompt);
      const response = await result.response;
      const imageUrl = response.text();

      if (!imageUrl) {
        throw new Error("No se pudo generar la imagen con Gemini");
      }

      return imageUrl;
    } catch (error) {
      console.error("Error generando imagen con Gemini:", error);
      throw error;
    }
  }

  private static async generateRecipeImageWithOpenAI(
    recipeTitle: string,
    ingredients: { name: string }[],
    steps: { description: string }[]
  ): Promise<string> {
    const ingString = ingredients.map((i) => i.name).join(", ");
    const stepsString = steps.map((s) => s.description).join(". ");

    const response = await openai.images.generate({
      prompt: `Foto realista y profesional del plato: ${recipeTitle}, que lleva: ${ingString}. Elaboración: ${stepsString}. Fondo neutro, buena iluminación.`,
      n: 1,
      size: "256x256",
      response_format: "url",
    });

    if (!response.data || !response.data[0].url) {
      throw new Error("No se pudo generar la imagen con OpenAI");
    }

    return response.data[0].url;
  }
}
