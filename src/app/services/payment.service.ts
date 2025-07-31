import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Processa o pagamento para um utilizador já logado que está a fazer o upgrade para o plano Pro.
   * @param paymentData - Os dados do pagamento retornados pelo Checkout Brick.
   */
  processProPayment(paymentData: any): Observable<any> {
    // A chamada real à API agora está ativa.
    return this.http.post(`${this.apiUrl}/process-payment-pro`, { paymentData })
      .pipe(catchError(this.handleError));
  }

  /**
   * Processa o pagamento para um novo cliente na página de vendas pública (Plano Básico).
   * @param paymentData - Os dados do pagamento retornados pelo Checkout Brick.
   * @param email - O e-mail que o cliente inseriu.
   */
  processPublicCheckout(paymentData: any, email: string): Observable<any> {
    const payload = { paymentData, email };
    // A chamada real à API agora está ativa.
    return this.http.post(`${this.apiUrl}/public-checkout`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no PaymentService!', error);
    const errorMessage = error.error?.message || 'Não foi possível processar o seu pagamento.';
    return throwError(() => new Error(errorMessage));
  }
}
