import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Recipe, Category } from '../../../models/recipe.model';
import { AdminRecipeFormComponent } from '../admin-recipe-form/admin-recipe-form.component';

@Component({
  selector: 'app-admin-recipes',
  standalone: true,
  imports: [CommonModule, AdminRecipeFormComponent],
  templateUrl: './admin-recipes.component.html',
  styleUrls: ['./admin-recipes.component.scss']
})
export class AdminRecipesComponent implements OnInit {
  recipes = signal<Recipe[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  
  isModalOpen = signal(false);
  selectedRecipe = signal<Recipe | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.loadCategories();
  }

  loadRecipes(): void {
    this.isLoading.set(true);
    this.adminService.getAllRecipes().subscribe(data => {
      this.recipes.set(data);
      this.isLoading.set(false);
    });
  }

  loadCategories(): void {
    this.adminService.getPublicCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  openCreateModal(): void {
    this.selectedRecipe.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(recipe: Recipe): void {
    this.selectedRecipe.set(recipe);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedRecipe.set(null);
  }

  onRecipeSaved(): void {
    this.loadRecipes();
    this.closeModal();
  }

  onDeleteRecipe(recipeId: string): void {
    // Lógica para o soft-delete da receita
    console.log(`Apagar receita: ${recipeId}`);
  }
}
