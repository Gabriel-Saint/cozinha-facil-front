import { Component, Input, OnInit, signal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, Category, RecipeFilters } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipes-section',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipes-section.component.html',
  styleUrls: ['./recipes-section.component.scss']
})
export class RecipesSectionComponent implements OnInit, OnChanges {
  @Input() searchTerm = '';

  categories = signal<Category[]>([]);
  filteredRecipes = signal<Recipe[]>([]);
  selectedCategory = signal<string>('todos');

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
   
    this.recipeService.getCategories().subscribe(apiCategories => {
      const allCategory: Category = {
        id: 'todos',
        name: 'Todos',
        emoji: '🍝',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.categories.set([allCategory, ...apiCategories]);
    });
    this.filterRecipes();
  }

  ngOnChanges(): void {
    this.filterRecipes();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.filterRecipes();
  }

  onFavoriteToggle(recipeId: string): void {
    console.log(`Recipe ${recipeId} favorite toggled`);
  }

  private filterRecipes(): void {
    const filters: RecipeFilters = {
      category: this.selectedCategory() !== 'todos' ? this.selectedCategory() : undefined,
      search: this.searchTerm || undefined
    };

    this.recipeService.getRecipes(filters).subscribe(recipes => {
      this.filteredRecipes.set(recipes);
    });
  }
}
