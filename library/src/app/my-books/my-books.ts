import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, Subject, switchMap, catchError, of, takeUntil, tap } from 'rxjs';

import { IssueService } from './issue.service';
import { FineService } from './fine.service';
import { Issue } from '../models/issue.model';
import { Fine } from '../models/fine.model';
import { FinesResponse } from '../models/fine.model';
import { DaysUntilPipe } from '../shared/days-until.pipe';
import { OverdueStatusPipe } from '../shared/overdue-status.pipe';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [
    CommonModule,
    DaysUntilPipe,
    OverdueStatusPipe,
    ConfirmDialog
  ],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyBooksComponent implements OnInit, OnDestroy {

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  issues$!: Observable<Issue[]>;
  fines$!: Observable<FinesResponse>;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  // --- Dialog State Properties ---
  isDialogOpen = false;
  dialogMessage = '';
  dialogMode: 'confirm' | 'alert' = 'confirm';
  pendingIssueId: number | null = null;

  constructor(
    private issueService: IssueService,
    private fineService: FineService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeStreams();
  }

  private initializeStreams(): void {
    this.issues$ = this.refreshTrigger$.pipe(
      tap(() => {
        this.errorMessage = null;
        // Keep success message visible for its timeout duration
      }),
      switchMap(() =>
        this.issueService.getMyIssues().pipe(
          catchError(() => {
            this.errorMessage = 'Failed to load borrowed books.';
            return of([]);
          })
        )
      )
    );

    this.fines$ = this.refreshTrigger$.pipe(
      switchMap(() =>
        this.fineService.getMyFines().pipe(
          catchError(() => {
            this.errorMessage = 'Failed to load fines.';
            return of({
              fines: [],
              totalFines: 0,
              paidFines: 0,
              pendingFines: 0
            });
          })
        )
      )
    );
  }

  // --- Return Book Logic ---
  // my-books.component.ts

get pageHeading(): string {
    return this.authService.isLibrarian() ? 'Borrowed Books' : 'My Books';
  }

returnBook(issueId: number): void {
  // 1. If we are already showing an error/success alert, close it on the next click
  if (this.dialogMode === 'alert') {
    this.closeDialogForReturn();
    return;
  }

  this.issueService.returnBook(issueId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.refreshTrigger$.next();
        
        // 2. Show success in an alert-style dialog
        this.dialogMode = 'alert';
        this.dialogMessage = response.hasFine 
          ? `Book returned. A fine of ${response.fine} has been added.` 
          : 'Book returned successfully!';
        
        this.isDialogOpen = true;
        this.cdr.markForCheck(); // Essential for OnPush
      },
      error: (err) => {
        // 3. Handle errors (like "Already returned" or "Server error")
        this.dialogMode = 'alert';
        this.dialogMessage = err.error?.error || 'Failed to return the book.';
        this.isDialogOpen = true;
        this.cdr.markForCheck(); 
      }
    });
}

closeDialogForReturn() {
  this.isDialogOpen = false;
  this.dialogMode = 'confirm';
  this.cdr.markForCheck();
}

  // --- Dialog Event Handlers ---
  handleDialogConfirm(): void {
    if (this.dialogMode === 'confirm' && this.pendingIssueId) {
      this.executeReturnAndPay(this.pendingIssueId);
    }
    this.closeDialog();
  }

  handleDialogCancel(): void {
    this.closeDialog();
  }

  private closeDialog(): void {
    this.isDialogOpen = false;
    this.pendingIssueId = null;
    // We don't clear dialogMessage immediately to avoid flicker during close animation
  }

  // --- Execution Methods ---
  private executeReturnAndPay(issueId: number): void {
    this.fineService.returnAndPay(issueId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.refreshTrigger$.next();
        
        // Show success notification instead of alert
        this.successMessage = res.message || 'Book returned and fine settled!';
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Payment/Return failed.';
      }
    });
  }

  private executeSimpleReturn(issueId: number): void {
    this.issueService.returnBook(issueId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.refreshTrigger$.next();
        this.successMessage = 'Book returned successfully!';
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to return book.';
      }
    });
  }

  renewBook(issueId: number): void {
  this.issueService.renewBook(issueId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.refreshTrigger$.next();
        this.successMessage = 'Book renewed successfully!';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        // Use the dialog pattern we built for BorrowAction
        this.dialogMode = 'alert';
        this.dialogMessage = err.error?.error || 'Renewal failed. Max renewals reached or book is overdue.';
        this.isDialogOpen = true;
        this.cdr.markForCheck(); // Ensure the dialog is visible
      }
    });
}

  payFine(issueId: number): void {
    this.fineService.payFine(issueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: () => {
        this.refreshTrigger$.next();
        this.successMessage = 'Fine paid successfully!';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: () =>
        this.errorMessage = 'Payment failed. Please try again.'
    });
  }

  // --- Helpers ---
  trackByIssue(index: number, issue: Issue): number {
    return issue.id;
  }

  trackByFine(index: number, fine: Fine): number {
    return fine.issueId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}