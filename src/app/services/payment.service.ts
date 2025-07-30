import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  // Este método será chamado pelo UpgradeProComponent
  processProPayment(paymentData: any): Observable<any> {
    // Em produção, esta seria a chamada real à API
    // return this.http.post(`${this.apiUrl}/process-payment-pro`, { paymentData });

    // Simulação para desenvolvimento
    console.log("A enviar para o back-end:", { paymentData });
    return of({ status: 'approved', id: 'mock_payment_123' }).pipe(delay(1500));
  }
}
