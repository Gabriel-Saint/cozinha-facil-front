import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {
  currentUser = signal<User | null>(null);
  isMenuOpen = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.currentUser = this.authService.currentUser;
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
