import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard'; // 1. Importe o AdminGuard

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    // canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    // canActivate: [AuthGuard]
  },
  {
    path: 'my-recipes',
    loadComponent: () => import('./components/my-recipes/my-recipes.component').then(m => m.MyRecipesComponent),
    // canActivate: [AuthGuard]
  },
  // 2. Adicione a nova secção de Admin com as suas rotas filhas
  {
    path: 'admin',
    // canActivate: [AuthGuard, AdminGuard], // Protegido por ambos os guardiões
    loadComponent: () => import('./components/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./components/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'recipes', loadComponent: () => import('./components/admin/admin-recipes/admin-recipes.component').then(m => m.AdminRecipesComponent) },
      { path: 'categories', loadComponent: () => import('./components/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
