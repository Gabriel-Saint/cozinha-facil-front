import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Recipe, Category, RecipeFilters } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipesSubject = new BehaviorSubject<Recipe[]>([]);
  public recipes$ = this.recipesSubject.asObservable();
  
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private myCategoriesSubject = new BehaviorSubject<Category[]>([]);
  public myCategories$ = this.myCategoriesSubject.asObservable();

  // Dados de exemplo para receitas públicas e premium
  private mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Mousse de Maracujá Rápido',
      description: 'Deliciosa mousse cremosa e refrescante',
      ingredients: 'Leite condensado, creme de leite, suco de maracujá',
      preparation: '1. No liquidificador, bata tudo por 3 minutos.\n2. Leve à geladeira por 2 horas.',
      prepTime: '15 min',
      servings: '6',
      icon: '🍋',
      accessLevel: 'PUBLIC',
      categoryId: 'sem-forno',
      authorId: 'admin',
      likesCount: 10,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Bolo de Chocolate Premium',
      description: 'Um bolo intenso para verdadeiros amantes de chocolate.',
      ingredients: 'Chocolate 70%, ovos, manteiga, açúcar',
      preparation: 'Receita exclusiva para membros Pro.',
      prepTime: '1h',
      servings: '8',
      icon: '🍫',
      accessLevel: 'PREMIUM',
      categoryId: 'guloseimas',
      authorId: 'admin',
      likesCount: 150,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Salmão Grelhado com Ervas',
      description: 'Uma opção leve e saudável para o jantar.',
      ingredients: 'Salmão, azeite, limão, alecrim, sal, pimenta',
      preparation: '1. Tempere o salmão.\n2. Grelhe por 5 minutos de cada lado.',
      prepTime: '20 min',
      servings: '2',
      icon: '🐟',
      accessLevel: 'PUBLIC',
      categoryId: 'saudavel',
      authorId: 'admin',
      likesCount: 85,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private mockCategories: Category[] = [
    { id: 'proteica', name: 'Proteicas', emoji: '💪', createdAt: new Date(), updatedAt: new Date() },
    { id: 'saudavel', name: 'Saudáveis', emoji: '🥗', createdAt: new Date(), updatedAt: new Date() },
    { id: 'sem-forno', name: 'Sem Forno', emoji: '🧊', createdAt: new Date(), updatedAt: new Date() },
    { id: 'guloseimas', name: 'Guloseimas', emoji: '🍩', createdAt: new Date(), updatedAt: new Date() }
  ];
  
  private mockMyCategories: Category[] = [
      { id: 'my-cat-1', name: 'Jantares da Semana', emoji: '📅', createdAt: new Date(), updatedAt: new Date() },
      { id: 'my-cat-2', name: 'Para Impressionar', emoji: '✨', createdAt: new Date(), updatedAt: new Date() }
  ];

  constructor() {
    // Simula carregamento inicial dos dados
    setTimeout(() => {
      this.recipesSubject.next(this.mockRecipes);
      this.categoriesSubject.next(this.mockCategories);
      this.myCategoriesSubject.next(this.mockMyCategories);
    }, 500);
  }

  getRecipes(filters?: RecipeFilters): Observable<Recipe[]> {
    return this.recipes$.pipe(
      map(recipes => {
        let filtered = [...recipes];

        if (filters?.accessLevel) {
          filtered = filtered.filter(recipe => recipe.accessLevel === filters.accessLevel);
        }
        
        if (filters?.category && filters.category !== 'todos') {
          filtered = filtered.filter(recipe => recipe.categoryId === filters.category);
        }
        
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(recipe => 
            recipe.title.toLowerCase().includes(searchTerm)
          );
        }
        
        return filtered;
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  updateRecipeFavoriteStatus(recipeId: string, isFavorited: boolean): void {
    const currentRecipes = this.recipesSubject.value;
    const updatedRecipes = currentRecipes.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorited }
        : recipe
    );
    this.recipesSubject.next(updatedRecipes);
  }

  getMyRecipes(): Observable<Recipe[]> {
    const myMockRecipes = this.mockRecipes.filter(r => r.authorId !== 'admin');
    return of(myMockRecipes).pipe(delay(500));
  }

  createMyRecipe(recipeData: Partial<Recipe>): Observable<Recipe> {
    const newRecipe: Recipe = {
      id: 'new-' + Math.random().toString(36).substr(2, 9),
      ...recipeData,
      accessLevel: 'PRIVATE',
      authorId: 'current-user',
      likesCount: 0,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Recipe;

    this.mockRecipes.push(newRecipe);
    this.recipesSubject.next(this.mockRecipes);

    return of(newRecipe).pipe(delay(1000));
  }

  uploadMyRecipeImage(recipeId: string, file: File): Observable<Recipe> {
    console.log(`Simulando upload da imagem ${file.name} para a receita ${recipeId}`);
    
    const currentRecipes = this.recipesSubject.value;
    let updatedRecipe: Recipe | undefined;
    const updatedRecipes = currentRecipes.map(recipe => {
      if (recipe.id === recipeId) {
        updatedRecipe = { ...recipe, imageUrl: 'https://via.placeholder.com/300' };
        return updatedRecipe;
      }
      return recipe;
    });

    if (updatedRecipe) {
      this.recipesSubject.next(updatedRecipes);
      return of(updatedRecipe).pipe(delay(1500));
    }

    return throwError(() => new Error('Receita não encontrada para o upload da imagem.'));
  }

  // --- MÉTODOS PARA GERIR CATEGORIAS PESSOAIS ---

  getMyCategories(): Observable<Category[]> {
    return this.myCategories$;
  }

  createMyCategory(categoryData: { name: string, emoji?: string }): Observable<Category> {
    const newCategory: Category = {
      id: 'my-cat-' + Math.random().toString(36).substr(2, 9),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentMyCategories = this.myCategoriesSubject.value;
    this.myCategoriesSubject.next([...currentMyCategories, newCategory]);
    
    return of(newCategory).pipe(delay(500));
  }

  updateMyCategory(categoryId: string, categoryData: { name: string, emoji?: string }): Observable<Category> {
    let updatedCategory: Category | undefined;
    const updatedCategories = this.myCategoriesSubject.value.map(cat => {
        if (cat.id === categoryId) {
            updatedCategory = { ...cat, ...categoryData, updatedAt: new Date() };
            return updatedCategory;
        }
        return cat;
    });

    if (updatedCategory) {
        this.myCategoriesSubject.next(updatedCategories);
        return of(updatedCategory).pipe(delay(500));
    }
    
    return throwError(() => new Error('Categoria não encontrada para atualização.'));
  }

  deleteMyCategory(categoryId: string): Observable<{ success: boolean }> {
    const updatedCategories = this.myCategoriesSubject.value.filter(c => c.id !== categoryId);
    this.myCategoriesSubject.next(updatedCategories);
    
    return of({ success: true }).pipe(delay(500));
  }
}
