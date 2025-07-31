import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // CORREÇÃO: Verificamos diretamente a presença do token.
    // Isto é mais fiável do que usar isLoggedIn() imediatamente após o login.
    const token = this.authService.getToken();
    
    if (token) {
      return true; // Se o token existir, permite o acesso.
    } else {
      // Se não houver token, redireciona para a página de login.
      return this.router.createUrlTree(['/login']);
    }
  }
}
