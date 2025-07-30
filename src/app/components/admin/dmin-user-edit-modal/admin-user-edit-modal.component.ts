import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-user-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-edit-modal.component.html',
  // Reutilizamos o ficheiro de estilos partilhado que está no seu Canvas
  styleUrls: ['../admin-shared/modal-form.scss']
})
export class AdminUserEditModalComponent implements OnInit {
  @Input() user!: User;
  @Output() closeModal = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();

  userForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.userForm = this.fb.group({
      newExpirationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Pode pré-preencher o formulário se o utilizador já tiver uma data de expiração
    if (this.user.subscription?.expiresAt) {
      const date = new Date(this.user.subscription.expiresAt);
      const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      this.userForm.patchValue({ newExpirationDate: formattedDate });
    }
  }

  onRenew(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const newDate = this.userForm.value.newExpirationDate;
    this.adminService.renewUserSubscription(this.user.id, new Date(newDate)).subscribe(() => {
      this.isLoading = false;
      this.userUpdated.emit();
    });
  }
}
