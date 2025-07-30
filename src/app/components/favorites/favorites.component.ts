import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { FavoriteService } from '../../services/favorite.service';
import { RecipeService } from '../../services/recipe.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteRecipes = signal<Recipe[]>([]);

  @Output() viewRecipe = new EventEmitter<Recipe>();

  constructor(
    private favoriteService: FavoriteService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    // Combine favorite IDs with recipes to get favorite recipes
    combineLatest([
      this.favoriteService.favoriteIds$,
      this.recipeService.recipes$
    ]).pipe(
      map(([favoriteIds, allRecipes]) => 
        allRecipes.filter(recipe => favoriteIds.includes(recipe.id))
      )
    ).subscribe(favoriteRecipes => {
      this.favoriteRecipes.set(favoriteRecipes);
    });
  }

   onFavoriteClickEmitForModal(recipe: Recipe): void {
    this.viewRecipe.emit(recipe);
  }
}
