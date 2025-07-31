import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    const currentUser = this.authService.currentUser();
    
    // Verifica se o utilizador tem uma subscrição com o status 'active'
    if (currentUser?.subscription?.status === 'active') {
      return true; // Se for Pro, permite o acesso.
    } else {
      // Se não for Pro, redireciona para a página de upgrade.
      return this.router.createUrlTree(['/upgrade-pro']);
    }
  }
}
