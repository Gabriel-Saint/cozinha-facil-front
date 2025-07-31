import { Component, Input, OnInit, signal, computed } from '@angular/core';
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
export class RecipesSectionComponent implements OnInit {
  // Usamos um setter para o @Input para o ligar a um signal
  @Input() set searchTerm(value: string) {
    this.searchTermSignal.set(value);
  }

  // Sinais para guardar o estado
  private allRecipes = signal<Recipe[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string>('todos');
  selectedAccessLevel = signal<'PUBLIC' | 'PREMIUM'>('PUBLIC');
  searchTermSignal = signal<string>('');
  
  isPro = computed(() => this.authService.currentUser()?.subscription?.status === 'active');


  filteredRecipes = computed(() => {
    const recipes = this.allRecipes();
    const accessLevel = this.selectedAccessLevel();
    const category = this.selectedCategory();
    const search = this.searchTermSignal();

    return recipes.filter(recipe => {
   
      const matchesAccessLevel = recipe.accessLevel === accessLevel;

      const matchesCategory = category === 'todos' || recipe.categoryId === category;
      
      const matchesSearch = !search || recipe.title.toLowerCase().includes(search.toLowerCase());

      return matchesAccessLevel && matchesCategory && matchesSearch;
    });
  });

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // CORREÇÃO: Carregamos os dados usando o método getRecipes() do serviço.
    this.recipeService.getRecipes().subscribe((recipes: Recipe[]) => {
      this.allRecipes.set(recipes);
    });

    this.recipeService.getCategories().subscribe(apiCategories => {
      // O seu código para adicionar a categoria "Todos" está perfeito
      const allCategory: Category = {
        id: 'todos', name: 'Todos', emoji: '🍝', createdAt: new Date(), updatedAt: new Date()
      };
      this.categories.set([allCategory, ...apiCategories]);
    });
  }

  // Agora, estas funções apenas atualizam o estado. O 'computed signal' faz o resto.
  onAccessLevelSelect(level: 'PUBLIC' | 'PREMIUM'): void {
    this.selectedAccessLevel.set(level);
    this.selectedCategory.set('todos'); // Reseta a categoria ao mudar de separador
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }
}
