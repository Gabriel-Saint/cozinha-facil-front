import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoginCredentials, LoginResponse, User } from '../models/user.model';
import { RegisterPayload } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'cozinha_facil_token';
  private readonly USER_KEY = 'cozinha_facil_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
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
    // ... (seu método de login mockado continua aqui)
    // Lembre-se de o substituir pela chamada real à API
    const mockUser: User = {
      id: '1', name: 'Usuário Demo', email: credentials.email,
      cpf: '123.456.789-00', role: 'CLIENT', createdAt: new Date(), updatedAt: new Date()
    };
    if (credentials.email === '123@gmail.com' && credentials.password === '12345678') {
      const mockResponse: LoginResponse = { user: mockUser, token: 'mock-jwt-token-' + Date.now() };
      return of(mockResponse).pipe(delay(1000), tap(response => this.saveAuthData(response.token, response.user)));
    } else {
      return throwError(() => new Error('Usuário ou senha incorreta!'));
    }
  }

  register(payload: RegisterPayload): Observable<User> {
    // ... (seu método de registo mockado continua aqui)
    const mockNewUser: User = {
      id: new Date().getTime().toString(), name: payload.name, email: payload.email,
      cpf: payload.cpf, role: 'CLIENT', createdAt: new Date(), updatedAt: new Date()
    };
    return of(mockNewUser).pipe(delay(1500));
  }

  /**
   * NOVO MÉTODO: Atualiza os dados do utilizador no localStorage e nos signals.
   * @param updatedUser - O objeto de utilizador com os dados atualizados.
   */
  updateCurrentUser(updatedUser: User): void {
    this.saveAuthData(this.getToken()!, updatedUser);
  }

  logout(): void {
    this.clearAuth();
  }

  private saveAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.setCurrentUser(user);
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
