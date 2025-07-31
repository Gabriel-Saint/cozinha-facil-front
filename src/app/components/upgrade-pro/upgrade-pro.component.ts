import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { Router, RouterModule } from '@angular/router';

// Declara o objeto MercadoPago para evitar erros de TypeScript
declare const MercadoPago: any;

@Component({
  selector: 'app-upgrade-pro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upgrade-pro.component.html',
  styleUrls: ['./upgrade-pro.component.scss']
})
export class UpgradeProComponent implements OnInit {
  isLoading = signal(true);
  isProcessing = signal(false);
  errorMessage = signal('');
  
  private mp: any;
  private paymentBrick: any;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadMercadoPagoScript();
  }

  goBack(): void {
    this.location.back();
  }

  private loadMercadoPagoScript(): void {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      this.initializeMercadoPago();
    };
    document.body.appendChild(script);
  }

  private initializeMercadoPago(): void {
    this.mp = new MercadoPago(''); // Sua Public Key de Teste
    this.initializePaymentBrick();
  }

  private async initializePaymentBrick(): Promise<void> {
    const bricksBuilder = this.mp.bricks();
    const settings = {
      initialization: {
        amount: 29.90,
      },
      customization: {
        visual: {
          style: {
            theme: 'default',
          },
        },
        // CORREÇÃO: A propriedade 'paymentMethods' foi movida para dentro de 'customization'
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          ticket: 'all', // Boleto
          bankTransfer: 'all'
        },
      },
      callbacks: {
        onReady: () => {
          this.isLoading.set(false);
        },
        onSubmit: (formData: any) => {
          this.isProcessing.set(true);
          this.errorMessage.set('');
          
          this.paymentService.processProPayment(formData).subscribe({
            next: (response) => {
              this.isProcessing.set(false);
              this.router.navigate(['/profile'], { queryParams: { upgrade: 'success' } });
            },
            error: (err) => {
              this.errorMessage.set(err.message || 'Não foi possível processar o seu pagamento.');
              this.isProcessing.set(false);
            }
          });
        },
        onError: (error: any) => {
          console.error('Erro no Brick:', error);
          this.errorMessage.set('Ocorreu um erro com os dados de pagamento.');
        },
      },
    };

    this.paymentBrick = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
  }

  processPayment(): void {
    if (this.paymentBrick) {
      this.paymentBrick.submit();
    }
  }
}
