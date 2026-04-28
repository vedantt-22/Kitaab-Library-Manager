import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  switchMap,
  startWith,
  catchError,
  of,
  map
} from 'rxjs';

import { Book } from '../../../models/book.model';
import { BookService } from '../../../books/book.service';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { LoadingSpinner } from '../../../shared/loading-spinner/loading-spinner';
import { HighlightDirective } from '../../../shared/highlight-directive';

interface AdminBooksVM {
  books: Book[];
  isLoading: boolean;
  errorMessage: string | null;
}

@Component({
  selector: 'app-book-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialog,
    LoadingSpinner,
    HighlightDirective
  ],
  templateUrl: './book-list-admin.html',
  styleUrls: ['./book-list-admin.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListAdminComponent {

  private refresh$ = new BehaviorSubject<void>(undefined);

  vm$!: Observable<AdminBooksVM>;

  showDialog = false;
  selectedBookId: number | null = null;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
    this.initializeStream();
  }

  private initializeStream(): void {

    this.vm$ = this.refresh$.pipe(

      switchMap(() =>
        this.bookService.getAll().pipe(

          map(books => ({
            books,
            isLoading: false,
            errorMessage: null
          })),

          startWith({
            books: [],
            isLoading: true,
            errorMessage: null
          }),

          catchError(() =>
            of({
              books: [],
              isLoading: false,
              errorMessage: 'Failed to load books.'
            })
          )
        )
      )
    );
  }

  editBook(id: number): void {
    this.router.navigate(['/librarian/books/edit', id]);
  }

  createBook(): void {
    this.router.navigate(['/librarian/books/new']);
  }

  confirmDelete(id: number): void {
    this.selectedBookId = id;
    this.showDialog = true;
  }

  deleteBook(): void {
    if (!this.selectedBookId) return;

    this.bookService.delete(this.selectedBookId)
      .subscribe({
        next: () => {
          this.refresh$.next();
          this.showDialog = false;
          this.selectedBookId = null;
        },
        error: () => {
          this.showDialog = false;
          this.selectedBookId = null;
        }
      });
  }

  cancelDelete(): void {
    this.showDialog = false;
    this.selectedBookId = null;
  }

  trackById(index: number, book: Book): number {
    return book.id;
  }
}