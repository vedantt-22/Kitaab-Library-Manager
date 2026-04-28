import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnDestroy {

  username = '';
  email = '';
  password = '';
  fullName = '';
  errorMessage: string | null = null;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {

    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      fullName: this.fullName
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/books']);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}