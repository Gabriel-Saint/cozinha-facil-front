import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly FAVORITES_KEY = 'favoriteRecipesCozinhaFacil';
  private apiUrl = `${environment.apiUrl}/recipes`;

  private favoriteIdsSubject = new BehaviorSubject<string[]>([]);
  public favoriteIds$ = this.favoriteIdsSubject.asObservable();
  
  public favoriteCount = signal<number>(0);

  constructor(
    private http: HttpClient
    // O RecipeService já não é necessário aqui, pois a comunicação é direta com a API
  ) {
    this.loadFavoritesFromStorage();
  }

  // Carrega os favoritos do cache local ao iniciar
  private loadFavoritesFromStorage(): void {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    if (stored) {
      try {
        const favoriteIds = JSON.parse(stored);
        this.favoriteIdsSubject.next(favoriteIds);
        this.favoriteCount.set(favoriteIds.length);
      } catch (error) {
        console.error('Erro ao carregar favoritos do cache:', error);
        this.favoriteIdsSubject.next([]);
      }
    }
  }

  // Salva os favoritos no cache local
  private saveFavorites(favoriteIds: string[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favoriteIds));
    this.favoriteCount.set(favoriteIds.length);
    this.favoriteIdsSubject.next(favoriteIds);
  }

  /**
   * Adiciona ou remove uma receita dos favoritos, comunicando com a API.
   * @param recipeId O ID da receita.
   */
  toggleFavorite(recipeId: string): Observable<boolean> {
    const currentFavorites = this.favoriteIdsSubject.value;
    const isCurrentlyFavorite = currentFavorites.includes(recipeId);

    let apiCall: Observable<any>;
    let newFavorites: string[];
    let newFavoriteState: boolean;

    if (isCurrentlyFavorite) {
      // Remove dos favoritos
      apiCall = this.http.delete(`${this.apiUrl}/${recipeId}/unfavorite`);
      newFavorites = currentFavorites.filter(id => id !== recipeId);
      newFavoriteState = false;
    } else {
      // Adiciona aos favoritos
      apiCall = this.http.post(`${this.apiUrl}/${recipeId}/favorite`, {});
      newFavorites = [...currentFavorites, recipeId];
      newFavoriteState = true;
    }

    return apiCall.pipe(
      tap(() => {
        // Se a chamada à API for bem-sucedida, atualizamos o estado local
        this.saveFavorites(newFavorites);
      }),
      map(() => newFavoriteState), // Retorna o novo estado de favorito
      catchError(this.handleError)
    );
  }

  isFavorite(recipeId: string): Observable<boolean> {
    return this.favoriteIds$.pipe(
      map(favoriteIds => favoriteIds.includes(recipeId))
    );
  }

  // NOTA: Este método deveria ser atualizado para buscar os favoritos da API
  // quando o utilizador faz login, para sincronizar o estado.
  syncFavoritesFromApi(favoriteIds: string[]): void {
    this.saveFavorites(favoriteIds);
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no FavoriteService!', error);
    const errorMessage = error.error?.message || 'Não foi possível atualizar os favoritos.';
    return throwError(() => new Error(errorMessage));
  }
}
