import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { MyCategoriesModalComponent } from '../my-categories-modal/my-categories-modal.component';
import { Recipe, Category } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { FormsModule } from '@angular/forms'; // 1. Importe o FormsModule

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RecipeCardComponent, RecipeFormComponent, MyCategoriesModalComponent, FormsModule], // 2. Adicione aos imports
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit {
  myRecipes = signal<Recipe[]>([]);
  myCategories = signal<Category[]>([]);
  
  filteredRecipes = signal<Recipe[]>([]);
  selectedCategory = signal<string>('todos');
  searchTerm = signal<string>('');

  isRecipeModalOpen = signal(false);
  isCategoryModalOpen = signal(false);
  
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadMyRecipes();
    this.loadMyCategories();
  }

  loadMyRecipes(): void {
    this.recipeService.getMyRecipes().subscribe(recipes => {
      this.myRecipes.set(recipes);
      this.filterRecipes();
    });
  }

  loadMyCategories(): void {
    this.recipeService.getMyCategories().subscribe(categories => {
      const allCategory: Category = {
        id: 'todos', name: 'Todas', emoji: '📖', createdAt: new Date(), updatedAt: new Date()
      };
      this.myCategories.set([allCategory, ...categories]);
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term.toLowerCase());
    this.filterRecipes();
  }
  
  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.filterRecipes();
  }

  filterRecipes(): void {
    let recipes = this.myRecipes();
    const term = this.searchTerm();

    if (this.selectedCategory() !== 'todos') {
      recipes = recipes.filter(r => r.categoryId === this.selectedCategory());
    }

    if (term) {
      recipes = recipes.filter(r => r.title.toLowerCase().includes(term));
    }
    
    this.filteredRecipes.set(recipes);
  }

  // Métodos para o modal de receitas
  openCreateRecipeModal(): void { this.isRecipeModalOpen.set(true); }
  closeRecipeModal(): void { this.isRecipeModalOpen.set(false); }
  onRecipeSaved(recipe: Recipe): void {
    this.loadMyRecipes();
    this.closeRecipeModal();
  }

  // Métodos para o novo modal de categorias
  openCategoryModal(): void { this.isCategoryModalOpen.set(true); }
  closeCategoryModal(): void { this.isCategoryModalOpen.set(false); }
  onCategoriesChanged(): void {
    this.loadMyCategories();
  }
}
