import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import { RecipesSectionComponent } from '../recipes-section/recipes-section.component';
import { VideoLessonsComponent } from '../video-lessons/video-lessons.component';
import { ProductsComponent } from '../products/products.component';
import { WhatsAppButtonComponent } from '../whatsapp-button/whatsapp-button.component';
import { Recipe } from '../../models/recipe.model';
import { RecipeModalComponent } from "../recipe-modal/recipe-modal.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FavoritesComponent,
    RecipesSectionComponent,
    VideoLessonsComponent,
    ProductsComponent,
    WhatsAppButtonComponent,
    RecipeModalComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  searchTerm = signal<string>('');
  selectedRecipeForModal = signal<Recipe | null>(null);

  constructor() {
    effect(() => {
      if (this.selectedRecipeForModal()) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  onViewFavorite(recipe: Recipe): void {
    this.selectedRecipeForModal.set(recipe);
  }

  onCloseModal(): void {
    this.selectedRecipeForModal.set(null);
  }
}
