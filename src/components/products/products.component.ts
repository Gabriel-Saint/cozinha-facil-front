import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products = [
    {
      title: 'Doces Fit & Saborosos',
      description: '30 receitas de sobremesas sem culpa para o seu dia a dia.',
      imageUrl: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=250&h=250&dpr=2',
      ratingCount: '1.284',
      ctaText: 'Eu Quero! R$ 29,90'
    },
    {
      title: 'Saladas Gourmet',
      description: 'Eleve suas saladas a outro nível com combinações incríveis.',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=250&h=250&dpr=2',
      ratingCount: '987',
      ctaText: 'Comprar por R$ 37,90'
    }
  ];
}
