import { Component, Input, OnInit, signal, OnChanges, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, Category, RecipeFilters } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipes-section',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent, RouterLink],
  templateUrl: './recipes-section.component.html',
  styleUrls: ['./recipes-section.component.scss']
})
export class RecipesSectionComponent implements OnInit, OnChanges {
  @Input() searchTerm = '';

  categories = signal<Category[]>([]);
  filteredRecipes = signal<Recipe[]>([]);
  selectedCategory = signal<string>('todos');
  
  // Novo estado para os separadores principais
  selectedAccessLevel = signal<'PUBLIC' | 'PREMIUM'>('PUBLIC');
  isPro = computed(() => this.authService.currentUser()?.subscription?.status === 'active');

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.recipeService.getCategories().subscribe(apiCategories => {
      const allCategory: Category = {
        id: 'todos', name: 'Todos', emoji: '🍝', createdAt: new Date(), updatedAt: new Date()
      };
      this.categories.set([allCategory, ...apiCategories]);
    });
    this.filterRecipes();
  }

  ngOnChanges(): void {
    this.filterRecipes();
  }

  onAccessLevelSelect(level: 'PUBLIC' | 'PREMIUM'): void {
    this.selectedAccessLevel.set(level);
    this.selectedCategory.set('todos'); // Reseta o filtro de categoria
    this.filterRecipes();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.filterRecipes();
  }

  private filterRecipes(): void {
    const filters: RecipeFilters = {
      accessLevel: this.selectedAccessLevel(),
      category: this.selectedCategory() !== 'todos' ? this.selectedCategory() : undefined,
      search: this.searchTerm || undefined
    };

    this.recipeService.getRecipes(filters).subscribe(recipes => {
      this.filteredRecipes.set(recipes);
    });
  }
}
