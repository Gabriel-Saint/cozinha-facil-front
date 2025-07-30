import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';
import { UpgradeProComponent } from './components/upgrade-pro/upgrade-pro.component'; // 1. Importe aqui

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    // canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'my-recipes',
    component: MyRecipesComponent,
    // canActivate: [AuthGuard]
  },
  // 2. Adicione a nova rota protegida para o upgrade
  {
    path: 'upgrade-pro',
    component: UpgradeProComponent,
    // canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
