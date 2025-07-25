import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoginCredentials, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'cozinha_facil_token';
  private readonly USER_KEY = 'cozinha_facil_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal for reactive UI
  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<User | null>(null);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.setCurrentUser(user);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Simulando chamada à API - substitua pela chamada real
    const mockUser: User = {
      id: '1',
      name: 'Usuário Demo',
      email: credentials.email,
      cpf: '123.456.789-00',
      role: 'CLIENT',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validação hardcoded do exemplo original
    if (credentials.email === '123@gmail.com' && 
        credentials.password === '12345678') {
      
      const mockResponse: LoginResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };

      return of(mockResponse).pipe(
        delay(1000), // Simula latência da rede
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.setCurrentUser(response.user);
        })
      );
    } else {
      return throwError(() => new Error('Usuário ou senha incorreta!'));
    }
  }

  logout(): void {
    this.clearAuth();
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.currentUser.set(user);
    this.isAuthenticated.set(!!user);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.setCurrentUser(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }
}