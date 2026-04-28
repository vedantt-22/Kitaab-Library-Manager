import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Book } from '../../models/book.model';
import { TruncatePipe } from '../../shared/truncate.pipe';
import { HighlightDirective } from '../../shared/highlight-directive';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    RouterLink,
    HighlightDirective
  ],
  templateUrl: './book-card.html',
  styleUrls: ['./book-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookCardComponent {

  @Input({ required: true }) book!: Book;
  @Input() isLoggedIn!: boolean;

  @Output() borrowClicked = new EventEmitter<number>();

  onBorrow(): void {
    this.borrowClicked.emit(this.book.id);
  }

  get isUnavailable(): boolean {
    return this.book?.availableCopies === 0;
  }

  get showBorrowButton(): boolean {
    return !!this.isLoggedIn && !!this.book;
  }
}