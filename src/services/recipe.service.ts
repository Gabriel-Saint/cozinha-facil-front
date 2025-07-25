import { Injectable, signal } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
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

  // Mock data baseado no HTML original
  private mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Mousse de Maracujá Rápido',
      description: 'Deliciosa mousse cremosa e refrescante',
      ingredients: 'Leite condensado, creme de leite, suco de maracujá',
      preparation: '1. No liquidificador, bata o leite condensado, o creme de leite e o suco de maracujá em velocidade alta por 3 minutos, até obter um creme liso e aerado.\n2. Despeje a mousse em uma travessa ou em taças individuais.\n3. Leve à geladeira por pelo menos 2 horas antes de servir.',
      prepTime: '15 min',
      servings: '6',
      icon: '🍋',
      accessLevel: 'PUBLIC',
      categoryId: 'sem-forno',
      authorId: 'admin',
      likesCount: 0,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Suflê de Palmito',
      description: 'Releitura saudável e saborosa',
      ingredients: 'Alho-poró, palmito, ovos, farinha de linhaça, fermento',
      preparation: '1. Refogue 1 alho-poró fatiado no azeite. Adicione 1 vidro de palmito picado e refogue mais um pouco. Deixe esfriar.\n2. Bata 3 claras em neve e reserve.\n3. Em outra tigela, bata 3 gemas com 3 colheres de leite, 2 de farinha de linhaça, sal e fermento.\n4. Misture o refogado de palmito à mistura de gemas e por último incorpore as claras em neve. Asse a 200°C por 30 minutos.',
      prepTime: '35 min',
      servings: '4',
      icon: '🌿',
      accessLevel: 'PUBLIC',
      categoryId: 'sem-gluten',
      authorId: 'admin',
      likesCount: 0,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Smoothie Proteico',
      description: 'Perfeito para pós-treino',
      ingredients: 'Banana, whey protein, leite de coco, aveia',
      preparation: '1. Bata todos os ingredientes no liquidificador.\n2. Sirva gelado.',
      prepTime: '5 min',
      servings: '1',
      icon: '💪',
      accessLevel: 'PUBLIC',
      categoryId: 'proteica',
      authorId: 'admin',
      likesCount: 0,
      isFavorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private mockCategories: Category[] = [
    { id: 'todos', name: 'Todos', emoji: '🍽️', createdAt: new Date(), updatedAt: new Date() },
    { id: 'proteica', name: 'Proteicas', emoji: '💪', createdAt: new Date(), updatedAt: new Date() },
    { id: 'saudavel', name: 'Saudáveis', emoji: '🥗', createdAt: new Date(), updatedAt: new Date() },
    { id: 'sem-forno', name: 'Sem Forno', emoji: '🧊', createdAt: new Date(), updatedAt: new Date() },
    { id: 'sem-acucar', name: 'Sem Açúcar', emoji: '🥑', createdAt: new Date(), updatedAt: new Date() },
    { id: 'guloseimas', name: 'Guloseimas', emoji: '🍩', createdAt: new Date(), updatedAt: new Date() },
    { id: 'sem-gluten', name: 'Sem Glúten', emoji: '🚫', createdAt: new Date(), updatedAt: new Date() }
  ];

  constructor() {
    // Simula carregamento inicial
    setTimeout(() => {
      this.recipesSubject.next(this.mockRecipes);
      this.categoriesSubject.next(this.mockCategories);
    }, 500);
  }

  getRecipes(filters?: RecipeFilters): Observable<Recipe[]> {
    return this.recipes$.pipe(
      map(recipes => {
        let filtered = [...recipes];
        
        if (filters?.category && filters.category !== 'todos') {
          filtered = filtered.filter(recipe => recipe.categoryId === filters.category);
        }
        
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(recipe => 
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm)
          );
        }
        
        return filtered;
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    return this.recipes$.pipe(
      map(recipes => recipes.find(recipe => recipe.id === id))
    );
  }

  // Método para atualizar o status de favorito de uma receita
  updateRecipeFavoriteStatus(recipeId: string, isFavorited: boolean): void {
    const currentRecipes = this.recipesSubject.value;
    const updatedRecipes = currentRecipes.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorited }
        : recipe
    );
    this.recipesSubject.next(updatedRecipes);
  }
}