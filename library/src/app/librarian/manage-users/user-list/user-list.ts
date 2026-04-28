import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../users-service/users.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // =============================
  // LOAD USERS
  // =============================
  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Failed to load users.';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  toggleActive(user: User): void {

  this.errorMessage = null;

  this.userService.updateUser(user.id, { isActive: !user.isActive })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.errorMessage = 'Failed to update user status.';
      }
    });
}

toggleRole(user: User): void {

  const updatedRole = user.role === 'user' ? 'librarian' : 'user';
  this.errorMessage = null;

  this.userService.updateUser(user.id, { role: updatedRole })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.errorMessage = 'Failed to update user role.';
      }
    });
}

  trackById(index: number, user: User): number {
    return user.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}