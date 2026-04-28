import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {

  username = '';
  password = '';
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

    this.authService.login(this.username, this.password)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/books']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}