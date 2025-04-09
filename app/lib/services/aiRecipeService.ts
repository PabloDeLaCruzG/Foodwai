import { openai } from "../openai";
import { AIRecipeData } from "../interfaces";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryHelper";
import axios from "axios";

export class AIRecipeService {
  static async generateRecipeFromPrompt(prompt: string): Promise<AIRecipeData> {
    const userLanguage = navigator.language;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Responde exclusivamente con JSON válido sin comentarios, sin explicaciones, sin etiquetas ni backticks.",
          },
          {
            role: "user",
            content: `Idioma: ${userLanguage || "es"}. ${prompt}`,
          },
        ],
      });

      const aiResult = response.choices[0]?.message?.content?.trim();
      if (!aiResult) {
        throw new Error("La API de OpenAI no devolvió resultado");
      }

      // Limpiar backticks o fences
      let cleanedResponse = aiResult.replace(/```/g, "").trim();

      // Extraer el contenido JSON si hubiera texto adicional
      const match = cleanedResponse.match(/\{[\s\S]*\}/);
      if (match) {
        cleanedResponse = match[0];
      }

      // Parsear con JSON
      const recipeData: AIRecipeData = JSON.parse(cleanedResponse);

      // Forzamos a que tenga un array de steps, y que no esté vacío
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

  static async generateRecipeImage(
    recipeTitle: string,
    ingredients: { name: string }[],
    steps: { description: string }[]
  ): Promise<string> {
    try {
      const ingString = ingredients.map((i) => i.name).join(", ");
      const stepsString = steps.map((s) => s.description).join(". ");

      const response = await openai.images.generate({
        prompt: `Foto realista y profesional del plato: ${recipeTitle}, que lleva: ${ingString}. Elaboración con pasos: ${stepsString}. Iluminación natural, alta resolución.`,
        n: 1,
        size: "512x512",
      });

      if (!response.data || !response.data[0].url) {
        throw new Error("No se pudo generar la imagen.");
      }

      console.log("Response GPT Image", response);

      const openaiImageUrl = response.data[0].url;
      const imageBuffer = await axios
        .get(openaiImageUrl, { responseType: "arraybuffer" })
        .then((res) => Buffer.from(res.data, "binary"));

      const uploaded = await uploadToCloudinary(imageBuffer);

      console.log("Uploaded Cloudinary", uploaded);

      return uploaded;
    } catch (error) {
      console.error("Error al generar imagen con OpenAI:", error);
      throw error;
    }
  }
}
