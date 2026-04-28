import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';
import { RoleDirective } from './shared/role-directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RoleDirective
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  user$: Observable<User | null>;
  sidebarCollapsed = false;

  constructor(public authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}