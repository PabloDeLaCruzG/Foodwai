import { openai } from "../openai";
import { AIRecipeData } from "../interfaces";
import cloudinary from "../cloudinary";
import axios from "axios";

export class AIRecipeService {
  static async generateRecipeFromPrompt(prompt: string): Promise<AIRecipeData> {
    try {
      // Definición de la función con el esquema que debe cumplir la respuesta
      const functions = [
        {
          name: "createRecipe",
          description:
            "Genera una receta en JSON válido siguiendo un esquema predefinido.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Título de la receta." },
              description: {
                type: "string",
                description: "Descripción de la receta.",
              },
              cookingTime: {
                type: "number",
                description: "Tiempo de cocción en minutos.",
              },
              difficulty: {
                type: "string",
                description: "Nivel de dificultad.",
              },
              costLevel: { type: "string", description: "Nivel de coste." },
              cuisine: { type: "string", description: "Tipo de cocina." },
              nutritionalInfo: {
                type: "object",
                properties: {
                  calories: { type: "number" },
                  protein: { type: "number" },
                  fat: { type: "number" },
                  carbs: { type: "number" },
                },
                required: ["calories", "protein", "fat", "carbs"],
              },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "number" },
                    unit: { type: "string" },
                  },
                  required: ["name", "quantity", "unit"],
                },
              },
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    stepNumber: { type: "number" },
                    description: { type: "string" },
                  },
                  required: ["stepNumber", "description"],
                },
              },
            },
            required: [
              "title",
              "description",
              "cookingTime",
              "difficulty",
              "costLevel",
              "cuisine",
              "nutritionalInfo",
              "ingredients",
              "steps",
            ],
          },
        },
      ];

      // Llamada a la API de OpenAI usando function calling
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613", // Versión compatible con function calling
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente culinario. Genera una receta en JSON válido siguiendo el esquema definido. No añadas ningún texto extra.",
          },
          {
            role: "user",
            content: `Idioma: ${process.env.SYSTEM_LANGUAGE || "en"}. ${prompt}`,
          },
        ],
        functions,
        function_call: "auto",
        temperature: 0,
        max_tokens: 800,
      });

      const message = response.choices[0].message;
      let recipeData: AIRecipeData;

      // Si se usó function calling, se obtiene directamente el JSON desde la propiedad function_call.arguments
      if (message?.function_call && message.function_call.arguments) {
        try {
          recipeData = JSON.parse(message.function_call.arguments);
        } catch (parseErr) {
          throw new Error(
            "Error al parsear la respuesta de función: " + parseErr
          );
        }
      } else {
        // Fallback: limpiar y parsear manualmente la respuesta
        let cleanedResponse = message?.content?.replace(/```/g, "").trim();
        const match = cleanedResponse?.match(/\{[\s\S]*\}/);
        if (match) {
          cleanedResponse = match[0];
        }
        recipeData = JSON.parse(cleanedResponse as string);
      }

      // Verificación mínima de formato
      if (
        !recipeData.steps ||
        !Array.isArray(recipeData.steps) ||
        recipeData.steps.length === 0
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

  private static uploadToCloudinary(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "foodwai" }, (err, result) => {
          if (err || !result) return reject(err);
          resolve(result.secure_url);
        })
        .end(buffer);
    });
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

      const openaiImageUrl = response.data[0].url;
      const imageBuffer = await axios
        .get(openaiImageUrl, { responseType: "arraybuffer" })
        .then((res) => Buffer.from(res.data, "binary"));
      const uploaded = await this.uploadToCloudinary(imageBuffer);
      return uploaded;
    } catch (error) {
      console.error("Error al generar imagen con OpenAI:", error);
      throw error;
    }
  }
}
