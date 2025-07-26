import { Component, Output, EventEmitter, signal, OnInit, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { debounceTime, distinctUntilChanged, Subject, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() searchTerm: string = ''; 
  @Output() searchChange = new EventEmitter<string>();
  
  favoriteCount = signal<number>(0);
  private searchSubject = new Subject<string>();

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private router: Router,
    private el: ElementRef
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

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerElement = this.el.nativeElement.querySelector('.main-header') as HTMLElement;
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
