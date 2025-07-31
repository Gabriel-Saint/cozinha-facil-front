// import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Recipe } from '../../models/recipe.model';
// import { FavoriteService } from '../../services/favorite.service';
// import { RecipeService } from '../../services/recipe.service';
// import { combineLatest, map } from 'rxjs';

// @Component({
//   selector: 'app-favorites',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './favorites.component.html',
//   styleUrls: ['./favorites.component.scss']
// })
// export class FavoritesComponent implements OnInit {
//   favoriteRecipes = signal<Recipe[]>([]);

//   @Output() viewRecipe = new EventEmitter<Recipe>();

//   constructor(
//     private favoriteService: FavoriteService,
//     private recipeService: RecipeService
//   ) {}

//   ngOnInit(): void {
//     // Combine favorite IDs with recipes to get favorite recipes
//     combineLatest([
//       this.favoriteService.favoriteIds$,
//       this.recipeService.recipes$
//     ]).pipe(
//       map(([favoriteIds, allRecipes]) => 
//         allRecipes.filter(recipe => favoriteIds.includes(recipe.id))
//       )
//     ).subscribe(favoriteRecipes => {
//       this.favoriteRecipes.set(favoriteRecipes);
//     });
//   }

//    onFavoriteClickEmitForModal(recipe: Recipe): void {
//     this.viewRecipe.emit(recipe);
//   }
// }

import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { FavoriteService } from '../../services/favorite.service';
import { RecipeService } from '../../services/recipe.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  @Output() viewRecipe = new EventEmitter<Recipe>();
  favoriteRecipes = signal<Recipe[]>([]);

  constructor(
    private favoriteService: FavoriteService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    // Este é o fluxo correto:
    // 1. Ouvimos as alterações nos IDs de favoritos.
    this.favoriteService.favoriteIds$.pipe(
      // 2. Sempre que os IDs mudarem, usamos switchMap para fazer uma nova chamada à API.
      switchMap(favoriteIds => 
        // 3. Chamamos o serviço para obter todas as receitas visíveis.
        this.recipeService.getRecipes().pipe(
          // 4. E então filtramos a lista completa para encontrar apenas as que são favoritas.
          map((allRecipes: Recipe[]) => 
            allRecipes.filter(recipe => favoriteIds.includes(recipe.id))
          )
        )
      )
    ).subscribe(favoriteRecipes => {
      // 5. Finalmente, atualizamos o nosso signal com as receitas favoritas.
      this.favoriteRecipes.set(favoriteRecipes);
    });
  }

  /**
   * NOVO MÉTODO: Emite o evento para abrir o modal da receita.
   * @param recipe A receita que foi clicada.
   */
  onFavoriteClickEmitForModal(recipe: Recipe): void {
    this.viewRecipe.emit(recipe);
  }
}
