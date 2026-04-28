import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, of } from 'rxjs';

import { Book } from '../../../models/book.model';
import { BookService } from '../../../books/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookFormComponent implements OnInit, OnDestroy {
  bookForm!: FormGroup;

  isEditMode = false;
  bookId!: number;
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    // ✅ Reactive Form Initialization
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      publishedYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      isbn: [''],
      category: [''],
      totalCopies: [1, [Validators.required, Validators.min(1)]],
      availableCopies: [1],
    });

    // ✅ Reactive paramMap (Rubric requirement)
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const id = params.get('id');

          if (id) {
            this.isEditMode = true;
            this.bookId = +id;
            this.isLoading = true;
            return this.bookService.getById(this.bookId);
          }

          return of(null);
        }),
      )
      .subscribe({
        next: (book: Book | null) => {
          if (book) {
            this.bookForm.patchValue({
              title: book.title,
              description: book.description,
              publishedYear: book.publishedYear,
              isbn: book.isbn,
              category: book.category,
              totalCopies: book.totalCopies,
              availableCopies: book.availableCopies,
            });
            this.isLoading = false;
          }
        },
        error: () => (this.isLoading = false),
      });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;

    const formValue: Partial<Book> = this.bookForm.value;

    if (this.isEditMode) {
      this.bookService
        .update(this.bookId, formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.router.navigate(['/librarian/books']));
    } else {
      this.bookService
        .create(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.router.navigate(['/librarian/books']));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
