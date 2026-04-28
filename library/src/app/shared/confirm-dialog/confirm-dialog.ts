import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
// src/app/shared/confirm-dialog.component.ts
export class ConfirmDialog {
  @Input() message: string = '';
  @Input() isOpen: boolean = false;
  
  // This is the key property that BorrowAction uses to switch modes
  @Input() dialogMode: 'confirm' | 'alert' = 'confirm'; 

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() { this.confirmed.emit(); }
  onCancel() { this.cancelled.emit(); }
}