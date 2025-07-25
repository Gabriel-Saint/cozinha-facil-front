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
    // Carregar categorias da API
    this.recipeService.getCategories().subscribe(apiCategories => {
      // CORREÇÃO: Adicionamos as propriedades em falta ao objeto "Todos"
      const allCategory: Category = {
        id: 'todos',
        name: 'Todos',
        emoji: '🍝',
        createdAt: new Date(), // Adicionado para satisfazer o tipo
        updatedAt: new Date()  // Adicionado para satisfazer o tipo
      };
      
      this.categories.set([allCategory, ...apiCategories]);
    });

    // Carregamento inicial das receitas
    this.filterRecipes();
  }

  ngOnChanges(): void {
    // Filtra as receitas sempre que o termo de busca mudar
    this.filterRecipes();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.filterRecipes();
  }

  onFavoriteToggle(recipeId: string): void {
    // A lógica de favoritar é tratada no RecipeCardComponent.
    // Este método pode ser usado para análises futuras.
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
