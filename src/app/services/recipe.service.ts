import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recipe, Category, RecipeFilters } from '../models/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl; // URL base da API: http://localhost:3000

  constructor(private http: HttpClient) {}

  /**
   * Busca as receitas da API com base nos filtros.
   */
  getRecipes(filters?: RecipeFilters): Observable<Recipe[]> {
    let params = new HttpParams();
    if (filters?.category) {
      params = params.set('categoryId', filters.category);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    // A API NestJS já lida com a lógica de acesso (Público vs Premium)
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca as categorias públicas da API.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca apenas as receitas criadas pelo utilizador Pro logado.
   */
  getMyRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes/my-recipes`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cria uma nova receita para o utilizador Pro.
   */
  createMyRecipe(recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipeData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Carrega uma imagem para uma receita criada pelo utilizador Pro.
   */
  uploadMyRecipeImage(recipeId: string, file: File): Observable<Recipe> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<Recipe>(`${this.apiUrl}/recipes/${recipeId}/upload-image`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // --- MÉTODOS PARA GERIR CATEGORIAS PESSOAIS ---

  /**
   * Busca as categorias criadas pelo utilizador Pro.
   */
  getMyCategories(): Observable<Category[]> {
    // Assumindo que a rota para categorias do utilizador será /my-categories
    return this.http.get<Category[]>(`${this.apiUrl}/my-categories`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cria uma nova categoria pessoal para o utilizador Pro.
   */
  createMyCategory(categoryData: { name: string, emoji?: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/my-categories`, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza uma categoria pessoal do utilizador Pro.
   */
  updateMyCategory(categoryId: string, categoryData: { name: string, emoji?: string }): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/my-categories/${categoryId}`, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Apaga uma categoria pessoal do utilizador Pro.
   */
  deleteMyCategory(categoryId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/my-categories/${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no RecipeService!', error);
    const errorMessage = error.error?.message || 'Ocorreu um erro desconhecido. Tente novamente.';
    return throwError(() => new Error(errorMessage));
  }
}
