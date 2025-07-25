import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Assumindo que já mudou para SASS
})
export class HeaderComponent implements OnInit {
  @Output() searchChange = new EventEmitter<string>();
  
  searchTerm = '';
  favoriteCount = signal<number>(0);
  private searchSubject = new Subject<string>();

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.favoriteCount = this.favoriteService.favoriteCount;
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchChange.emit(searchTerm);
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * NOVA FUNÇÃO: Rola a página até a secção desejada.
   * @param sectionId O ID do elemento HTML para onde rolar.
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
