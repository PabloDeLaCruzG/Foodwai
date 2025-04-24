import { openai } from "../openai";
import { getGeminiModels } from "../gemini";
import { AIRecipeData } from "../interfaces";
import { uploadToCloudinary } from "../utils/cloudinaryHelper";
import axios from "axios";

export class AIRecipeService {
  private static MAX_RETRIES = 3;
  private static readonly VALID_DIFFICULTY = ["Fácil", "Media", "Difícil"];
  private static readonly VALID_COST = ["Económico", "Moderado", "Alto"];

  private static validateRecipeData(data: AIRecipeData): string | null {
    try {
      if (!data) return "La receta está vacía";

      // Validar campos de texto básicos
      if (!data.title?.trim()) return "Título inválido";
      if (!data.description?.trim()) return "Descripción inválida";
      if (!data.cuisine?.trim()) return "Tipo de cocina inválido";

      // Validar difficulty y costLevel
      if (!this.VALID_DIFFICULTY.includes(data.difficulty)) {
        return `Dificultad inválida: ${data.difficulty}. Debe ser uno de: ${this.VALID_DIFFICULTY.join(", ")}`;
      }
      if (!this.VALID_COST.includes(data.costLevel)) {
        return `Nivel de costo inválido: ${data.costLevel}. Debe ser uno de: ${this.VALID_COST.join(", ")}`;
      }

      // Validar cookingTime
      if (typeof data.cookingTime !== "number" || data.cookingTime <= 0) {
        return `Tiempo de cocción inválido: ${data.cookingTime}`;
      }

      // Validar nutritionalInfo
      const ni = data.nutritionalInfo;
      if (!ni) return "Información nutricional faltante";

      const nutritionalFields: (keyof typeof ni)[] = [
        "calories",
        "protein",
        "fat",
        "carbs",
      ];
      for (const field of nutritionalFields) {
        if (typeof ni[field] !== "number" || ni[field] < 0) {
          return `Campo nutricional '${field}' inválido: ${ni[field]}`;
        }
      }

      // Validar ingredientes
      if (!Array.isArray(data.ingredients)) {
        return "La lista de ingredientes no es un array";
      }
      if (data.ingredients.length === 0) {
        return "La lista de ingredientes está vacía";
      }

      for (const [index, ing] of data.ingredients.entries()) {
        if (!ing.name?.trim()) {
          return `Ingrediente ${index + 1}: nombre faltante o inválido`;
        }
        if (typeof ing.quantity !== "number" || ing.quantity <= 0) {
          return `Ingrediente ${index + 1} (${ing.name}): cantidad inválida ${ing.quantity}`;
        }
        if (!ing.unit?.trim()) {
          return `Ingrediente ${index + 1} (${ing.name}): unidad faltante o inválida`;
        }
      }

      // Validar pasos
      if (!Array.isArray(data.steps)) {
        return "La lista de pasos no es un array";
      }
      if (data.steps.length === 0) {
        return "La lista de pasos está vacía";
      }

      for (const [index, step] of data.steps.entries()) {
        if (typeof step.stepNumber !== "number" || step.stepNumber <= 0) {
          return `Paso ${index + 1}: número de paso inválido ${step.stepNumber}`;
        }
        if (!step.description?.trim()) {
          return `Paso ${index + 1}: descripción faltante o inválida`;
        }
      }

      return null;
    } catch (error) {
      return `Error inesperado en la validación: ${error instanceof Error ? error.message : "Error desconocido"}`;
    }
  }

  static async generateRecipeFromPrompt(
    prompt: string,
    useGemini: boolean = false
  ): Promise<AIRecipeData> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const recipeData = useGemini
          ? await this.generateRecipeWithGemini(prompt)
          : await this.generateRecipeWithOpenAI(prompt);

        const validationError = this.validateRecipeData(recipeData);
        if (validationError) {
          throw new Error(`Datos de receta inválidos: ${validationError}`);
        }

        return recipeData;
      } catch (error) {
        lastError = error as Error;
        console.error(`Intento ${attempt} fallido:`, error);

        // Si es el último intento, intentar con el otro modelo
        if (attempt === this.MAX_RETRIES && !useGemini) {
          console.log("Intentando con Gemini como fallback...");
          try {
            const recipeData = await this.generateRecipeWithGemini(prompt);
            const validationError = this.validateRecipeData(recipeData);
            if (!validationError) return recipeData;
          } catch (geminiError) {
            console.error("Fallback a Gemini también falló:", geminiError);
          }
        }
      }
    }

    throw new Error(
      `No se pudo generar la receta después de ${this.MAX_RETRIES} intentos. Último error: ${lastError?.message}`
    );
  }

  private static cleanJsonResponse(text: string): string {
    // Eliminar cualquier texto antes del primer {
    let cleanedText = text.substring(text.indexOf("{"));

    // Eliminar cualquier texto después del último }
    const lastBraceIndex = cleanedText.lastIndexOf("}");
    if (lastBraceIndex !== -1) {
      cleanedText = cleanedText.substring(0, lastBraceIndex + 1);
    }

    // Eliminar comentarios de una línea y multilínea
    cleanedText = cleanedText
      .replace(/\/\*[\s\S]*?\*\//g, "") // Elimina comentarios multilínea
      .replace(/\/\/.*/g, "") // Elimina comentarios de una línea
      .replace(/\n\s*\n/g, "\n") // Elimina líneas vacías extra
      .trim();

    // Asegurarse de que es un JSON válido intentando parsearlo
    try {
      JSON.parse(cleanedText);
      return cleanedText;
    } catch {
      // Si falla, intentar una limpieza más agresiva
      cleanedText = cleanedText
        .replace(/[\r\n\t]/g, "") // Elimina saltos de línea y tabs
        .replace(/\s+/g, " ") // Reduce espacios múltiples a uno solo
        .replace(/,\s*}/g, "}") // Elimina comas trailing
        .replace(/,\s*]/g, "]"); // Elimina comas trailing en arrays

      // Intentar parse una última vez
      JSON.parse(cleanedText); // Si falla aquí, dejamos que el error se propague
      return cleanedText;
    }
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
          "El JSON debe contener una receta con las siguientes especificaciones:\n" +
          "- title: nombre atractivo y descriptivo\n" +
          "- description: descripción apetitosa y detallada\n" +
          "- cookingTime: tiempo en minutos (número)\n" +
          `- difficulty: uno de [${this.VALID_DIFFICULTY.join(", ")}]\n` +
          `- costLevel: uno de [${this.VALID_COST.join(", ")}]\n` +
          "- cuisine: tipo de cocina específico\n" +
          "- nutritionalInfo: objeto con calories, protein, fat, carbs (todos números positivos)\n" +
          "- ingredients: array de objetos con name (string), quantity (número positivo), unit (string)\n" +
          "- steps: array de objetos con stepNumber (número positivo), description (string detallado)\n\n" +
          "Idioma: es. " +
          prompt,
      ]);

      const response = await result.response;
      const text = response.text();
      console.log("🔍 Respuesta raw de Gemini:", text);

      // Extraer y limpiar el JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se encontró JSON válido en la respuesta de Gemini");
      }

      const cleanedJson = this.cleanJsonResponse(jsonMatch[0]);
      console.log("✨ JSON limpio:", cleanedJson);

      const recipeData: AIRecipeData = JSON.parse(cleanedJson);

      // Validación con mensaje específico
      const validationError = this.validateRecipeData(recipeData);
      if (validationError) {
        console.error("Error de validación específico:", validationError);
        throw new Error(`Error de validación: ${validationError}`);
      }

      return recipeData;
    } catch (error) {
      console.error("Error al generar receta con Gemini:", error);
      throw error;
    }
  }

  // Método principal de generación de imágenes
  static async generateRecipeImage(
    recipeTitle: string,
    ingredients: { name: string }[],
    steps: { description: string }[]
  ): Promise<string> {
    try {
      const imageUrl = await this.generateRecipeImageWithOpenAI(
        recipeTitle,
        ingredients,
        steps
      );
      return imageUrl;
    } catch (error) {
      console.error("Error al generar imagen:", error);
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
      size: "1024x1024",
      model: "dall-e-3",
      quality: "standard",
      response_format: "url",
    });

    if (!response.data || !response.data[0].url) {
      throw new Error("No se pudo generar la imagen con OpenAI");
    }

    // Descargar la imagen de OpenAI
    const imageResponse = await axios.get(response.data[0].url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(imageResponse.data);

    // Subir a Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer);
    return cloudinaryUrl;
  }
}
