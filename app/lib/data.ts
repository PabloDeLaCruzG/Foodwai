import axios from "axios";
import { GenerateRecipeBody, IRecipe, IUser } from "./interfaces";
import config from "./config";

// Configurar axios para usar la URL base según el entorno
const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

export const recipeApi = {
  /**
   * Obtiene todas las recetas del backend.
   * Promete recibir un array de Recetas de tipo Receta
   */
  getAllRecipes: async (): Promise<IRecipe[]> => {
    try {
      const response = await api.get("/api/recipes");
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las recetas:", error);
      throw error;
    }
  },

  getRecipesByAuthor: async (authorId: string): Promise<IRecipe[]> => {
    try {
      const response = await api.get("/api/recipes/author", {
        params: { authorId },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las recetas:", error);
      throw error;
    }
  },

  /**
   * Obtiene una receta por su ID.
   * @param id ID de la receta a buscar
   */
  getRecipeById: async (id: string): Promise<IRecipe> => {
    try {
      const response = await api.get(`/api/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la receta con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una receta por su ID.
   * @param id ID de la receta a eliminar
   */
  deleteRecipeById: async (id: string) => {
    try {
      const response = await api.delete(`/api/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la receta con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva receta.
   * @param recipe Datos de la nueva receta
   */
  createRecipe: async (recipe: IRecipe) => {
    try {
      const response = await api.post("/api/recipes", recipe);
      return response.data;
    } catch (error) {
      console.error("Error al crear la receta:", error);
      throw error;
    }
  },

  /**
   * Genera una receta automáticamente con base en los parámetros enviados.
   * @param recipeParams Parámetros para generar la receta
   */
  generateRecipe: async (recipeParams: GenerateRecipeBody) => {
    try {
      const response = await api.post("/api/recipes/generate", recipeParams, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al generar la receta:", error);
      throw error;
    }
  },

  generateImageForRecipe: async (recipeId: string) => {
    try {
      const response = await api.post(
        "/api/recipes/generateImage",
        { recipeId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al generar la imagen de la receta:", error);
      throw error;
    }
  },

  /**
   * Marca o desmarca una receta como favorita
   * @param id ID de la receta
   * @param isFavorite nuevo estado de favorito
   */
  toggleFavorite: async (id: string, isFavorite: boolean): Promise<IRecipe> => {
    try {
      const response = await api.put(`/api/recipes/${id}`, { isFavorite });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      throw error;
    }
  },
};

export const authApi = {
  googleAuth: async (idToken: string) => {
    try {
      const response = await api.post("/api/auth/googleAuth", { idToken });
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  },
  /**
   * Registra un usuario en el backend.
   * @param user Datos del usuario a registrar
   */
  registerUser: async (user: IUser) => {
    try {
      const response = await api.post("/api/auth/register", user);
      return response.data;
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  },

  /**
   * Loginea un usuario en el backend.
   * @param user Datos del usuario a loginear
   */
  loginUser: async (user: IUser) => {
    try {
      const response = await api.post("/api/auth/login", user);
      return response.data;
    } catch (error) {
      console.error("Error al loginear el usuario:", error);
      throw error;
    }
  },

  logoutUser: async () => {
    try {
      const response = await api.post("/api/auth/logout", {});
      return response.data;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  },

  /**
   * Verifica si un email existe en la base de datos.
   * @param email Email a verificar
   */
  checkEmailExists: async (email: string) => {
    try {
      const response = await api.post("/api/auth/checkEmailExists", { email });
      return response.data;
    } catch (error) {
      console.error("Error al verificar el email:", error);
      throw error;
    }
  },
};

export const userApi = {
  getCurrentUser: async () => {
    try {
      const response = await api.get("/api/users/user");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  },

  watchAdReward: async () => {
    try {
      const response = await api.post("/api/users/watchAdReward", {});
      return response.data;
    } catch (error) {
      console.error("Error al procesar la recompensa:", error);
      throw error;
    }
  },

  getDailyStatus: async () => {
    try {
      const response = await api.get("/api/users/dailyStatus");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el estado diario:", error);
      throw error;
    }
  },
};
