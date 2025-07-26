// import { Component, OnInit, signal, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { UserService } from '../../services/user.service';
// import { User } from '../../models/user.model';
// import { HeaderComponent } from "../header/header.component"; // Importe o Header

// @Component({
//     selector: 'app-profile',
//     standalone: true,
//     imports: [CommonModule, ReactiveFormsModule, HeaderComponent], // Adicione o HeaderComponent
//     templateUrl: './profile.component.html',
//     styleUrls: ['./profile.component.scss']
// })
// export class ProfileComponent implements OnInit {
//   currentUser = signal<User | null>(null);
//   isPro = computed(() => this.currentUser()?.subscription?.status === 'active');
  
//   profileForm: FormGroup;
//   passwordForm: FormGroup;

//   isLoadingProfile = signal(false);
//   isLoadingPassword = signal(false);
//   successMessage = signal('');
//   errorMessage = signal('');

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private userService: UserService
//   ) {
//     this.profileForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       email: [{ value: '', disabled: true }], // O e-mail não pode ser alterado
//       cpf: [{ value: '', disabled: true }] // O CPF não pode ser alterado
//     });

//     this.passwordForm = this.fb.group({
//       oldPassword: ['', [Validators.required]],
//       newPassword: ['', [Validators.required, Validators.minLength(8)]]
//     });
//   }

//   ngOnInit(): void {
//     this.currentUser.set(this.authService.currentUser());
//     if (this.currentUser()) {
//       this.profileForm.patchValue({
//         name: this.currentUser()?.name,
//         email: this.currentUser()?.email,
//         cpf: this.currentUser()?.cpf
//       });
//     }
//   }

//   onFileSelected(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file && this.isPro()) {
//       this.isLoadingProfile.set(true);
//       this.userService.uploadAvatar(file).subscribe({
//         next: (updatedUser) => {
//           this.authService.updateCurrentUser(updatedUser); // Atualiza o utilizador localmente
//           this.currentUser.set(updatedUser);
//           this.successMessage.set('Avatar atualizado com sucesso!');
//           this.isLoadingProfile.set(false);
//         },
//         error: (err) => {
//           this.errorMessage.set('Falha ao carregar o avatar. Tente novamente.');
//           this.isLoadingProfile.set(false);
//         }
//       });
//     }
//   }

//   onUpdateProfile(): void {
//     if (this.profileForm.invalid) return;

//     this.isLoadingProfile.set(true);
//     this.clearMessages();
    
//     const { name } = this.profileForm.value;
//     this.userService.updateProfile({ name }).subscribe({
//       next: (updatedUser) => {
//         this.authService.updateCurrentUser(updatedUser);
//         this.currentUser.set(updatedUser);
//         this.successMessage.set('Perfil atualizado com sucesso!');
//         this.isLoadingProfile.set(false);
//       },
//       error: (err) => {
//         this.errorMessage.set('Erro ao atualizar o perfil.');
//         this.isLoadingProfile.set(false);
//       }
//     });
//   }

//   onChangePassword(): void {
//     if (this.passwordForm.invalid) return;

//     this.isLoadingPassword.set(true);
//     this.clearMessages();

//     const { oldPassword, newPassword } = this.passwordForm.value;
//     this.userService.changePassword(oldPassword, newPassword).subscribe({
//       next: () => {
//         this.successMessage.set('Senha alterada com sucesso!');
//         this.passwordForm.reset();
//         this.isLoadingPassword.set(false);
//       },
//       error: (err) => {
//         this.errorMessage.set(err.message || 'Erro ao alterar a senha.');
//         this.isLoadingPassword.set(false);
//       }
//     });
//   }

//   private clearMessages(): void {
//     this.successMessage.set('');
//     this.errorMessage.set('');
//   }
// }
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser = signal<User | null>(null);
  isPro = computed(() => this.currentUser()?.subscription?.status === 'active');
  
  profileForm: FormGroup;
  passwordForm: FormGroup;

  isLoadingProfile = signal(false);
  isLoadingPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }],
      cpf: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    const userFromAuth = this.authService.currentUser();
    
    // SOLUÇÃO TEMPORÁRIA: Se não houver utilizador, usamos dados de exemplo para visualização.
    if (userFromAuth) {
        this.currentUser.set(userFromAuth);
    } else {
        console.warn("AuthService não forneceu um utilizador. A usar dados de exemplo para visualização.");
        const mockUser: User = {
            id: 'mock-id',
            name: 'Utilizador de Teste (PRO)',
            email: 'teste@email.com',
            cpf: '000.000.000-00',
            role: 'CLIENT',
            avatarUrl: null, // Teste com avatar nulo
            subscription: {
                id: 'sub-mock',
                status: 'active',
                expiresAt: new Date('2025-12-31'),
                paymentHistory: [
                    { id: 'pay1', amount: 29.90, paymentDate: new Date(), invoiceId: 'inv1' },
                    { id: 'pay2', amount: 29.90, paymentDate: new Date('2025-06-26'), invoiceId: 'inv2' }
                ]
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.currentUser.set(mockUser);
    }

    // Preenche o formulário com os dados do utilizador (real ou de exemplo)
    if (this.currentUser()) {
      this.profileForm.patchValue({
        name: this.currentUser()?.name,
        email: this.currentUser()?.email,
        cpf: this.currentUser()?.cpf
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.isPro()) {
      this.isLoadingProfile.set(true);
      this.userService.uploadAvatar(file).subscribe({
        next: (updatedUser) => {
          this.authService.updateCurrentUser(updatedUser);
          this.currentUser.set(updatedUser);
          this.successMessage.set('Avatar atualizado com sucesso!');
          this.isLoadingProfile.set(false);
        },
        error: (err) => {
          this.errorMessage.set('Falha ao carregar o avatar. Tente novamente.');
          this.isLoadingProfile.set(false);
        }
      });
    }
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isLoadingProfile.set(true);
    this.clearMessages();
    
    const { name } = this.profileForm.value;
    this.userService.updateProfile({ name }).subscribe({
      next: (updatedUser) => {
        this.authService.updateCurrentUser(updatedUser);
        this.currentUser.set(updatedUser);
        this.successMessage.set('Perfil atualizado com sucesso!');
        this.isLoadingProfile.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erro ao atualizar o perfil.');
        this.isLoadingProfile.set(false);
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isLoadingPassword.set(true);
    this.clearMessages();

    const { oldPassword, newPassword } = this.passwordForm.value;
    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.successMessage.set('Senha alterada com sucesso!');
        this.passwordForm.reset();
        this.isLoadingPassword.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Erro ao alterar a senha.');
        this.isLoadingPassword.set(false);
      }
    });
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
