import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recipe, Category } from '../../../models/recipe.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-recipe-form.component.html',
  styleUrls: ['../admin-shared/modal-form.scss'] // Reutilizamos o estilo partilhado
})
export class AdminRecipeFormComponent implements OnInit {
  @Input() recipe: Recipe | null = null;
  @Input() categories: Category[] = []; // Recebe as categorias públicas
  @Output() closeModal = new EventEmitter<void>();
  @Output() recipeSaved = new EventEmitter<void>();

  recipeForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      ingredients: ['', Validators.required],
      preparation: ['', Validators.required],
      prepTime: [''],
      servings: [''],
      icon: [''],
      accessLevel: ['PUBLIC', Validators.required],
      categoryId: [null]
    });
  }

  ngOnInit(): void {
    if (this.recipe) {
      this.recipeForm.patchValue(this.recipe);
    }
  }

  onSave(): void {
    if (this.recipeForm.invalid) return;
    this.isLoading = true;

    const recipeData = this.recipeForm.value;
    const saveObservable = this.recipe 
      ? this.adminService.updateAdminRecipe(this.recipe.id, recipeData)
      : this.adminService.createAdminRecipe(recipeData);

    saveObservable.subscribe({
      next: () => {
        this.isLoading = false;
        this.recipeSaved.emit();
      },
      error: (err) => {
        console.error("Erro ao salvar a receita:", err);
        this.isLoading = false;
        // Adicionar feedback de erro para o utilizador aqui
      }
    });
  }
}
