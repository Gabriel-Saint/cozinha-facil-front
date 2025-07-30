import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { AdminUserEditModalComponent } from '../admin-user-edit-modal/admin-user-edit-modal.component'; // 1. Importe o modal

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminUserEditModalComponent], // 2. Adicione aos imports
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  isModalOpen = signal(false);
  selectedUser = signal<User | null>(null);

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

  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedUser.set(null);
  }

  onUserUpdated(): void {
    this.loadUsers(); // Recarrega a lista para mostrar os dados atualizados
    this.closeModal();
  }

  onDeleteUser(userId: string): void {
    // Lógica para o soft-delete do utilizador
    console.log(`Apagar utilizador: ${userId}`);
  }
}
