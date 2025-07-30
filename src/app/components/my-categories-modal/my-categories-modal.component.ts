import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component'; // 1. Importe o novo componente

@Component({
  selector: 'app-my-categories-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmationModalComponent], // 2. Adicione aos imports
  templateUrl: './my-categories-modal.component.html',
  styleUrls: ['./my-categories-modal.component.scss']
})
export class MyCategoriesModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() categoriesChanged = new EventEmitter<void>();

  myCategories = signal<Category[]>([]);
  newCategoryForm: FormGroup;
  isLoading = signal(false);

  // Lógica para o modal de confirmação
  showConfirmModal = signal(false);
  categoryToDeleteId = signal<string | null>(null);

  constructor(
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) {
    this.newCategoryForm = this.fb.group({
      name: ['', Validators.required],
      emoji: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.recipeService.getMyCategories().subscribe(categories => {
      this.myCategories.set(categories);
    });
  }

  onAddCategory(): void {
    if (this.newCategoryForm.invalid) return;

    this.isLoading.set(true);
    const categoryData = this.newCategoryForm.value;
    this.recipeService.createMyCategory(categoryData).subscribe(() => {
      this.newCategoryForm.reset();
      this.isLoading.set(false);
      this.categoriesChanged.emit();
      this.loadCategories();
    });
  }

  // Agora, esta função apenas abre o modal de confirmação
  onDeleteCategory(categoryId: string): void {
    this.categoryToDeleteId.set(categoryId);
    this.showConfirmModal.set(true);
  }

  // Esta função é chamada quando o utilizador confirma a exclusão
  onConfirmDelete(): void {
    const id = this.categoryToDeleteId();
    if (id) {
      this.recipeService.deleteMyCategory(id).subscribe(() => {
        this.categoriesChanged.emit();
        this.loadCategories();
        this.closeConfirmModal();
      });
    }
  }

  // Fecha o modal de confirmação
  closeConfirmModal(): void {
    this.showConfirmModal.set(false);
    this.categoryToDeleteId.set(null);
  }
}
