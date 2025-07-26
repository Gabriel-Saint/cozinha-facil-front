import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component'; // 1. Importe o novo componente

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // 2. Adicione a nova rota protegida para o perfil
  { 
    path: 'profile', 
    component: ProfileComponent,
    // canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' } // Redireciona para o dashboard em vez do login ????
];
