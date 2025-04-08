import { openai } from "../openai";
import { AIRecipeData } from "../interfaces";
import cloudinary from "../cloudinary";
import axios from "axios";

export class AIRecipeService {
  static async generateRecipeFromPrompt(prompt: string): Promise<AIRecipeData> {
    try {
      const functions = [
        {
          name: "createRecipe",
          description:
            "Genera una receta en JSON válido siguiendo un esquema predefinido.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              cookingTime: { type: "number" },
              difficulty: { type: "string" },
              costLevel: { type: "string" },
              cuisine: { type: "string" },
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
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente culinario. Genera una receta en JSON válido siguiendo el esquema definido. No añadas ningún texto extra.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        functions,
        // Se usa 'tool_calls' ya que 'function_call' está deprecado.
        function_call: "auto", // Aún se configura de esta forma, pero se espera que la respuesta la entregues mediante 'tool_calls'
        temperature: 0,
        max_tokens: 800,
      });

      // Accedemos a la respuesta utilizando la nueva propiedad 'tool_calls'
      const message = response.choices[0].message;
      let recipeData: AIRecipeData;

      if (
        message?.tool_calls &&
        message.tool_calls.length > 0 &&
        message.tool_calls[0].function
      ) {
        try {
          recipeData = JSON.parse(message.tool_calls[0].id);
        } catch (parseErr) {
          console.error(
            "Error parseando la respuesta de tool_calls:",
            parseErr
          );
          throw new Error("Error al parsear el JSON devuelto por la función.");
        }
      } else {
        // Fallback: limpiamos y parseamos manualmente la respuesta
        const fallbackContent = message?.content || "";
        console.warn(
          "No se usó tool_calls. Respuesta fallback:",
          fallbackContent
        );
        let cleanedResponse = fallbackContent.replace(/```/g, "").trim();
        const match = cleanedResponse.match(/\{[\s\S]*\}/);
        if (match) {
          cleanedResponse = match[0];
        }
        recipeData = JSON.parse(cleanedResponse as string);
      }

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
