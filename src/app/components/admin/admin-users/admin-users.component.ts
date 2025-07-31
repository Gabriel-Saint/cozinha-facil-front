import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { AdminUserEditModalComponent } from '../admin-user-edit-modal/admin-user-edit-modal.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component'; // 1. Importe o modal de confirmação

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminUserEditModalComponent, ConfirmationModalComponent], // 2. Adicione aos imports
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  isEditModalOpen = signal(false);
  selectedUser = signal<User | null>(null);

  // Sinais para o modal de confirmação de exclusão
  isConfirmDeleteModalOpen = signal(false);
  userToDeleteId = signal<string | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.adminService.getUsers().subscribe(data => {
      this.users.set(data);
      this.isLoading.set(false);
    });
  }

  // Lógica para o modal de edição
  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedUser.set(null);
  }

  onUserUpdated(): void {
    this.loadUsers();
    this.closeEditModal();
  }

  // Lógica para o modal de exclusão
  openDeleteConfirmModal(userId: string): void {
    this.userToDeleteId.set(userId);
    this.isConfirmDeleteModalOpen.set(true);
  }

  closeDeleteConfirmModal(): void {
    this.isConfirmDeleteModalOpen.set(false);
    this.userToDeleteId.set(null);
  }

  onConfirmDelete(): void {
    const id = this.userToDeleteId();
    if (id) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.loadUsers(); // Recarrega a lista após apagar
        this.closeDeleteConfirmModal();
      });
    }
  }
}
