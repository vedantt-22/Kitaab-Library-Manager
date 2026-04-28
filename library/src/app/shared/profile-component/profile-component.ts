import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { FineService } from '../../my-books/fine.service';
import { User } from '../../models/user.model';
import { FinesResponse } from '../../models/fine.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  // A combined stream for total profile intelligence
  profileStats$!: Observable<{ user: User | null; fines: FinesResponse | null }>;

  constructor(
    private authService: AuthService,
    private fineService: FineService
  ) {}

  ngOnInit(): void {
    this.profileStats$ = combineLatest({
      user: this.authService.currentUser$,
      fines: this.fineService.getMyFines().pipe(
        // Start with zeros to avoid layout shift while loading
        startWith({ totalFines: 0, paidFines: 0, pendingFines: 0, fines: [] })
      )
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}