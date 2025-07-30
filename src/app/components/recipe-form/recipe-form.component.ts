import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  @Input() recipe: Recipe | null = null; // Para edição futura
  @Output() closeModal = new EventEmitter<void>();
  @Output() recipeSaved = new EventEmitter<Recipe>();

  recipeForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      ingredients: ['', Validators.required],
      preparation: ['', Validators.required],
      prepTime: [''],
      servings: [''],
      // categoryId: [null] // Para as categorias do utilizador
    });
  }

  ngOnInit(): void {
    if (this.recipe) {
      this.recipeForm.patchValue(this.recipe);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) return;

    this.isLoading = true;
    const formData = this.recipeForm.value;

    // Lógica para criar ou atualizar
    this.recipeService.createMyRecipe(formData).subscribe(newRecipe => {
      if (this.selectedFile) {
        // Se houver imagem, faz o upload após criar a receita
        this.recipeService.uploadMyRecipeImage(newRecipe.id, this.selectedFile!).subscribe(() => {
          this.isLoading = false;
          this.recipeSaved.emit(newRecipe);
        });
      } else {
        this.isLoading = false;
        this.recipeSaved.emit(newRecipe);
      }
    });
  }
}
