import { Component, Output, EventEmitter, signal, OnInit, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { debounceTime, distinctUntilChanged, Subject, map } from 'rxjs';
import { ProfileMenuComponent } from "../profile-menu/profile-menu.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileMenuComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() searchTerm: string = ''; 
  @Output() searchChange = new EventEmitter<string>();
  
  favoriteCount = signal<number>(0);
  private searchSubject = new Subject<string>();

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private el: ElementRef,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.favoriteCount = this.favoriteService.favoriteCount;
    
    this.searchSubject.pipe(
      debounceTime(300),
      map(term => term.trim().toLowerCase()),
      distinctUntilChanged()
    ).subscribe(normalizedTerm => {
      this.searchChange.emit(normalizedTerm);
    });
  }

  isHomePage(): boolean {
    return this.router.url.startsWith('/dashboard') || this.router.url === '/';
  }

  // NOVA FUNÇÃO: Verifica se a página atual é a de "Minhas Receitas"
  isMyRecipesPage(): boolean {
    return this.router.url.startsWith('/my-recipes');
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  scrollToSection(sectionId: string): void {
    if (this.isHomePage()) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.router.navigate(['/dashboard'], { fragment: sectionId });
    }
  }
}
