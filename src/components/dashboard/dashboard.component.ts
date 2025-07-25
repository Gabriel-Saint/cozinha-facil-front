import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import { RecipesSectionComponent } from '../recipes-section/recipes-section.component';
import { VideoLessonsComponent } from '../video-lessons/video-lessons.component';
import { ProductsComponent } from '../products/products.component';
import { WhatsAppButtonComponent } from '../whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FavoritesComponent,
    RecipesSectionComponent,
    VideoLessonsComponent,
    ProductsComponent,
    WhatsAppButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  searchTerm = signal<string>('');

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
