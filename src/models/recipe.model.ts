export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  preparation: string;
  prepTime: string;
  servings: string;
  icon?: string;
  imageUrl?: string;
  accessLevel: 'PUBLIC' | 'PREMIUM' | 'PRIVATE';
  categoryId?: string;
  category?: Category;
  authorId: string;
  author?: User;
  likesCount: number;
  isFavorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteRecipe {
  userId: string;
  recipeId: string;
  assignedAt: Date;
}

export interface RecipeFilters {
  category?: string;
  search?: string;
}