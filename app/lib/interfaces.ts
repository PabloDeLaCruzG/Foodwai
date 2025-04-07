export interface NutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Step {
  stepNumber: number;
  description: string;
}

export interface IRecipe {
  _id?: string;
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  costLevel: string;
  cuisine: string;
  nutritionalInfo: NutritionalInfo;
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateRecipeBody {
  selectedCuisines: string[];
  dietRestrictions: string[];
  extraAllergens: string;
  ingredientsToInclude: string[];
  ingredientsToExclude: string[];
  time: string;
  difficulty: string;
  cost: string;
  servings: number;
  purpose: string;
  extraDetails: string;
}

export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIRecipeData {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  costLevel: string;
  cuisine: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  steps: Array<{
    stepNumber: number;
    description: string;
  }>;
}

export interface GenerateRecipeBody {
  selectedCuisines: string[];
  dietRestrictions: string[];
  extraAllergens: string;
  ingredientsToInclude: string[];
  ingredientsToExclude: string[];
  time: string;
  difficulty: string;
  cost: string;
  servings: number;
  purpose: string;
  extraDetails: string;
}
