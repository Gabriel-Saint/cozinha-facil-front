import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Output() favoriteToggle = new EventEmitter<string>();
  
  isExpanded = signal<boolean>(false);
  isFavorited = signal<boolean>(false);

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    // Check if recipe is favorited
    this.favoriteService.isFavorite(this.recipe.id).subscribe(
      isFav => this.isFavorited.set(isFav)
    );
  }

  toggleExpanded(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation(); // Prevent card expansion
    
    this.favoriteService.toggleFavorite(this.recipe.id).subscribe(
      isFavorited => {
        this.isFavorited.set(isFavorited);
        this.favoriteToggle.emit(this.recipe.id);
      }
    );
  }

  formatPreparation(preparation: string): string {
    // Convert line breaks to HTML breaks
    return preparation.replace(/\n/g, '<br>');
  }
}
