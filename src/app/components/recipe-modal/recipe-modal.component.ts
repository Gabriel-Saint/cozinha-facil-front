import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss']
})
export class RecipeModalComponent implements OnInit {
  @Input() recipe: Recipe | null = null;
  @Output() closeModal = new EventEmitter<void>();
  
  isFavorited = signal<boolean>(true); // Começa como favorito, pois só abre a partir de um

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    if (this.recipe) {
      this.favoriteService.isFavorite(this.recipe.id).subscribe(
        isFav => this.isFavorited.set(isFav)
      );
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onModalContentClick(event: Event): void {
    event.stopPropagation();
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    if (this.recipe) {
      this.favoriteService.toggleFavorite(this.recipe.id).subscribe(
        isFavorited => {
          this.isFavorited.set(isFavorited);
          if (!isFavorited) {
            this.onClose();
          }
        }
      );
    }
  }

  formatHtml(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
