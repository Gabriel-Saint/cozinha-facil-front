import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly FAVORITES_KEY = 'favoriteRecipesCozinhaFacil';
  private favoriteIdsSubject = new BehaviorSubject<string[]>([]);
  public favoriteIds$ = this.favoriteIdsSubject.asObservable();
  
  // Signal para UI reativa
  public favoriteCount = signal<number>(0);

  constructor(private recipeService: RecipeService) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    if (stored) {
      try {
        const favoriteIds = JSON.parse(stored);
        this.favoriteIdsSubject.next(favoriteIds);
        this.favoriteCount.set(favoriteIds.length);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        this.favoriteIdsSubject.next([]);
      }
    }
  }

  private saveFavorites(favoriteIds: string[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favoriteIds));
    this.favoriteCount.set(favoriteIds.length);
  }

  toggleFavorite(recipeId: string): Observable<boolean> {
    const currentFavorites = this.favoriteIdsSubject.value;
    const index = currentFavorites.indexOf(recipeId);
    let newFavorites: string[];
    let isFavorited: boolean;

    if (index > -1) {
      // Remove dos favoritos
      newFavorites = currentFavorites.filter(id => id !== recipeId);
      isFavorited = false;
    } else {
      // Adiciona aos favoritos
      newFavorites = [...currentFavorites, recipeId];
      isFavorited = true;
    }

    this.favoriteIdsSubject.next(newFavorites);
    this.saveFavorites(newFavorites);
    
    // Atualiza o status no serviço de receitas
    this.recipeService.updateRecipeFavoriteStatus(recipeId, isFavorited);

    return of(isFavorited);
  }

  isFavorite(recipeId: string): Observable<boolean> {
    return this.favoriteIds$.pipe(
      map(favoriteIds => favoriteIds.includes(recipeId))
    );
  }

  getFavoriteRecipes(): Observable<Recipe[]> {
    return this.favoriteIds$.pipe(
      map(favoriteIds => {
        // Em uma aplicação real, faria uma chamada à API com os IDs
        // Por agora, filtra das receitas em memória
        return [];
      })
    );
  }

  clearAllFavorites(): Observable<void> {
    this.favoriteIdsSubject.next([]);
    this.saveFavorites([]);
    return of(void 0);
  }
}