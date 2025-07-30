import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Category } from '../../../models/recipe.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);
  editingCategory = signal<Category | null>(null);

  categoryForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      emoji: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    // Assumindo que um método getPublicCategories será criado no AdminService
    this.adminService.getPublicCategories().subscribe(data => {
      this.categories.set(data);
      this.isLoading.set(false);
    });
  }

  openCreateModal(): void {
    this.editingCategory.set(null);
    this.categoryForm.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(category: Category): void {
    this.editingCategory.set(category);
    this.categoryForm.patchValue(category);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onSaveCategory(): void {
    if (this.categoryForm.invalid) return;

    const categoryData = this.categoryForm.value;
    const editingCat = this.editingCategory();

    if (editingCat) {
      // Lógica de atualização
      this.adminService.updateCategory(editingCat.id, categoryData).subscribe(() => {
        this.loadCategories();
        this.closeModal();
      });
    } else {
      // Lógica de criação
      this.adminService.createCategory(categoryData).subscribe(() => {
        this.loadCategories();
        this.closeModal();
      });
    }
  }

  onDeleteCategory(categoryId: string): void {
    if (confirm('Tem a certeza que quer apagar esta categoria?')) {
      this.adminService.deleteCategory(categoryId).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
