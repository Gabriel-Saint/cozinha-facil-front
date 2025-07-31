// import { Injectable } from '@angular/core';
// import {
//   HttpEvent,
//   HttpInterceptor,
//   HttpHandler,
//   HttpRequest,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     // Obtém o token de autenticação do AuthService
//     const authToken = this.authService.getToken();

//     // Se o token existir, clona a requisição e adiciona o cabeçalho de autorização
//     if (authToken) {
//       const authReq = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${authToken}`),
//       });
//       // Envia a nova requisição com o cabeçalho
//       return next.handle(authReq);
//     }

//     // Se não houver token, envia a requisição original sem modificação
//     return next.handle(req);
//   }
// }

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  console.log('[AuthInterceptor] Interceptando requisição:', req.url);

  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Adiciona o cabeçalho do ngrok
  let headers = req.headers.set('ngrok-skip-browser-warning', '69420');

  // Se houver token, adiciona o Authorization também
  if (authToken) {
    headers = headers.set('Authorization', `Bearer ${authToken}`);
  }

  // Clona a requisição com os novos headers
  const authReq = req.clone({ headers });

  return next(authReq);
};

