import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // CORREÇÃO: O URL base agora vem do ficheiro de ambiente e aponta para a rota correta.
  private apiUrl = `${environment.apiUrl}/users`; 

  constructor(private http: HttpClient) {}

  /**
   * Atualiza os dados do perfil do utilizador logado.
   * @param profileData - Os dados a serem atualizados (ex: { name: 'Novo Nome' }).
   */
  updateProfile(profileData: { name?: string; avatarUrl?: string }): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, profileData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Carrega um novo avatar para o utilizador logado.
   * @param file - O ficheiro de imagem a ser carregado.
   */
  uploadAvatar(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Nota: Não definimos o 'Content-Type' header aqui. 
    // O browser faz isso automaticamente para uploads de ficheiros (multipart/form-data).
    return this.http.patch<User>(`${this.apiUrl}/me/avatar`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Altera a senha do utilizador logado.
   * @param oldPassword - A senha atual do utilizador.
   * @param newPassword - A nova senha desejada.
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = { oldPassword, newPassword };
    return this.http.patch(`${this.apiUrl}/me/password`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manipulador de erros genérico para as chamadas HTTP.
   */
  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no UserService!', error);
    const errorMessage = error.error?.message || 'Ocorreu um erro desconhecido. Tente novamente mais tarde.';
    return throwError(() => new Error(errorMessage));
  }
}
