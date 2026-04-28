import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';

import { Book } from '../../models/book.model';
import { BookService } from '../book.service';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailComponent implements OnInit, OnDestroy {

  book: Book | null = null;
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {

          const idParam = params.get('id');
          const id = Number(idParam);

          if (!idParam || isNaN(id)) {
            console.error('Invalid book ID');
            return EMPTY;
          }

          this.isLoading = true;
          return this.bookService.getById(id);
        })
      )
      .subscribe({
        next: (book) => {
          this.book = book;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load book', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}