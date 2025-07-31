import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, catchError, tap } from 'rxjs/operators';
import { LoginCredentials, LoginResponse, User } from '../models/user.model';
import { RegisterPayload } from '../models/register.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'cozinha_facil_token';
  private readonly USER_KEY = 'cozinha_facil_user';
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
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

  /**
   * Efetua o login fazendo uma chamada real à API.
   */
  login(credentials: {loginIdentifier: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => {
        this.saveAuthData(response.token, response.user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Regista um novo utilizador fazendo uma chamada real à API.
   */
  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza os dados do utilizador no localStorage e nos signals.
   */
  updateCurrentUser(updatedUser: User): void {
    const token = this.getToken();
    if (token) {
      this.saveAuthData(token, updatedUser);
    }
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

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no AuthService!', error);
    // Extrai a mensagem de erro da resposta da API NestJS
    const errorMessage = error.error?.message || 'Ocorreu um erro desconhecido. Tente novamente.';
    return throwError(() => new Error(errorMessage));
  }
}
