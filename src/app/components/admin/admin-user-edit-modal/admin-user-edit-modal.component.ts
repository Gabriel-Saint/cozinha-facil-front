import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../models/user.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-user-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-edit-modal.component.html',
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
      newExpirationDate: ['']
    });
  }

  ngOnInit(): void {
    // Pode pré-preencher o formulário se necessário
  }

  onRenew(): void {
    this.isLoading = true;
    const newDate = this.userForm.value.newExpirationDate;
    this.adminService.renewUserSubscription(this.user.id, new Date(newDate)).subscribe(() => {
      this.isLoading = false;
      this.userUpdated.emit();
    });
  }
}
