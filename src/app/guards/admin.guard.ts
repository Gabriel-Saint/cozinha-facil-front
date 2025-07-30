import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.currentUser();
    
    // Verifica se o utilizador está logado E se tem o papel de ADMIN
    if (this.authService.isAuthenticated() && currentUser?.role === 'ADMIN') {
      return true;
    } else {
      // Se não for admin, redireciona para o dashboard principal
      return this.router.createUrlTree(['/dashboard']);
    }
  }
}
