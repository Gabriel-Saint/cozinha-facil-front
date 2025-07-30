import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Recipe, Category } from '../models/recipe.model';

// Tipos para os dados do dashboard
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

  // Mocks para simulação
  private mockRecipes = new BehaviorSubject<Recipe[]>([]);
  private mockCategories = new BehaviorSubject<Category[]>([
    { id: 'proteica', name: 'Proteicas', emoji: '💪', createdAt: new Date(), updatedAt: new Date() },
    { id: 'saudavel', name: 'Saudáveis', emoji: '🥗', createdAt: new Date(), updatedAt: new Date() },
  ]);

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return of({ totalUsers: 125, proUsers: 25, totalRecipes: 150 }).pipe(delay(500));
  }

  getUsers(): Observable<User[]> {
    const mockUsers: User[] = [
      { id: '1', name: 'Cliente Básico', email: 'basico@email.com', cpf: '111', role: 'CLIENT', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'Cliente Pro', email: 'pro@email.com', cpf: '222', role: 'CLIENT', createdAt: new Date(), updatedAt: new Date(), subscription: { id: 'sub1', status: 'active', expiresAt: new Date() } },
    ];
    return of(mockUsers).pipe(delay(800));
  }
  
  getAllRecipes(): Observable<Recipe[]> {
    // return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`);
    return this.mockRecipes.asObservable().pipe(delay(800));
  }

  // --- MÉTODOS DE GESTÃO DE RECEITAS (PELO ADMIN) ---
  createAdminRecipe(recipeData: Partial<Recipe>): Observable<Recipe> {
    const newRecipe = { ...recipeData, id: 'admin-recipe-' + Math.random() } as Recipe;
    const current = this.mockRecipes.value;
    this.mockRecipes.next([...current, newRecipe]);
    return of(newRecipe).pipe(delay(500));
  }

  updateAdminRecipe(id: string, recipeData: Partial<Recipe>): Observable<Recipe> {
    let updatedRecipe: Recipe | undefined;
    const updatedList = this.mockRecipes.value.map(r => {
      if (r.id === id) {
        updatedRecipe = { ...r, ...recipeData };
        return updatedRecipe;
      }
      return r;
    });
    this.mockRecipes.next(updatedList);
    return updatedRecipe ? of(updatedRecipe).pipe(delay(500)) : throwError(() => new Error('Receita não encontrada'));
  }

  renewUserSubscription(userId: string, newDate: Date): Observable<User> {
    console.log(`A renovar subscrição para ${userId} até ${newDate.toLocaleDateString()}`);
    // Aqui iria a chamada PATCH /admin/users/:id/renew-subscription
    return of({} as User).pipe(delay(500));
  }


  // --- MÉTODOS DE GESTÃO DE CATEGORIAS (MOCKADOS) ---
  getPublicCategories(): Observable<Category[]> {
    return this.mockCategories.asObservable().pipe(delay(500));
  }

  createCategory(categoryData: { name: string, emoji?: string }): Observable<Category> {
    const newCategory: Category = {
      id: 'cat-' + Math.random(),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const currentCategories = this.mockCategories.value;
    this.mockCategories.next([...currentCategories, newCategory]);
    return of(newCategory).pipe(delay(500));
  }

  updateCategory(id: string, categoryData: { name: string, emoji?: string }): Observable<Category> {
    let updatedCategory: Category | undefined;
    const updatedList = this.mockCategories.value.map(cat => {
      if (cat.id === id) {
        updatedCategory = { ...cat, ...categoryData, updatedAt: new Date() };
        return updatedCategory;
      }
      return cat;
    });
    this.mockCategories.next(updatedList);
    return updatedCategory ? of(updatedCategory).pipe(delay(500)) : throwError(() => new Error('Categoria não encontrada'));
  }

  deleteCategory(id: string): Observable<any> {
    const updatedList = this.mockCategories.value.filter(cat => cat.id !== id);
    this.mockCategories.next(updatedList);
    return of({ success: true }).pipe(delay(500));
  }
}
