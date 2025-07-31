import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Recipe, Category } from '../models/recipe.model';

export interface DashboardStats {
  totalUsers: number;
  proUsers: number;
  totalRecipes: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  private categoriesApiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`).pipe(
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }
  
  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`).pipe(
      catchError(this.handleError)
    );
  }

  createAdminRecipe(recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipeData).pipe(
      catchError(this.handleError)
    );
  }

  updateAdminRecipe(id: string, recipeData: Partial<Recipe>): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.apiUrl}/recipes/${id}`, recipeData).pipe(
      catchError(this.handleError)
    );
  }

  renewUserSubscription(userId: string, newDate: Date): Observable<User> {
    const payload = { expirationDate: newDate.toISOString() };
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}/renew-subscription`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Realiza o soft-delete de um utilizador.
   */
  deleteUser(userId: string): Observable<any> {
    // Assumindo que a sua API terá um endpoint DELETE /admin/users/:id
    return this.http.delete(`${this.apiUrl}/users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- MÉTODOS DE GESTÃO DE CATEGORIAS ---

  getPublicCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesApiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createCategory(categoryData: { name: string, emoji?: string }): Observable<Category> {
    return this.http.post<Category>(this.categoriesApiUrl, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(id: string, categoryData: { name: string, emoji?: string }): Observable<Category> {
    return this.http.patch<Category>(`${this.categoriesApiUrl}/${id}`, categoryData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.categoriesApiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no AdminService!', error);
    const errorMessage = error.error?.message || 'Ocorreu um erro desconhecido. Tente novamente.';
    return throwError(() => new Error(errorMessage));
  }
}
