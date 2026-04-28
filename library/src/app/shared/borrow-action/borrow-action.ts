import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef, // 1. Import this
  OnDestroy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../my-books/issue.service';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-borrow-action',
  standalone: true,
  imports: [CommonModule, ConfirmDialog],
  template: `
    <app-confirm-dialog
      [isOpen]="isDialogOpen"
      [message]="dialogMessage"
      [dialogMode]="dialogMode"
      (confirmed)="executeBorrow()"
      (cancelled)="close()">
    </app-confirm-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BorrowAction implements OnDestroy {
  @Input() set bookToBorrow(id: number | null) {
    if (id) this.openConfirmation(id);
  }
  
  @Output() borrowSuccess = new EventEmitter<void>();
  @Output() flowClosed = new EventEmitter<void>();

  isDialogOpen = false;
  dialogMessage = '';
  dialogMode: 'confirm' | 'alert' = 'confirm';
  
  private currentBookId: number | null = null;
  private destroy$ = new Subject<void>();

  // 2. Update constructor to inject ChangeDetectorRef
  constructor(
    private issueService: IssueService,
    private cdr: ChangeDetectorRef 
  ) {}

  private openConfirmation(id: number) {
    this.currentBookId = id;
    this.dialogMessage = 'Are you sure you want to borrow this book?';
    this.dialogMode = 'confirm';
    this.isDialogOpen = true;
    this.cdr.markForCheck(); // Ensure dialog opens
  }

  executeBorrow() {
    if (this.dialogMode === 'alert') {
      this.close();
      return;
    }

    if (!this.currentBookId) return;

    this.issueService.borrowBook(this.currentBookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.borrowSuccess.emit();
          this.close();
          this.cdr.markForCheck();
        },
        error: (err) => {
          // 3. Update state in the error block
          this.dialogMode = 'alert';
          this.dialogMessage = err.error?.error || 'You already have this book borrowed';
          this.isDialogOpen = true;

          // 4. Force Angular to detect the switch from 'confirm' to 'alert'
          this.cdr.markForCheck(); 
        }
      });
  }

  close() {
    this.isDialogOpen = false;
    this.currentBookId = null;
    this.flowClosed.emit();
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}