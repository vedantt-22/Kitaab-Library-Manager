import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { BorrowAction } from '../../shared/borrow-action/borrow-action';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';
import { Book } from '../../models/book.model';
import { IssueService } from '../../my-books/issue.service';
import { AuthService } from '../../auth/auth.service';

import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
  combineLatest,
  BehaviorSubject,
  map,
  takeUntil
} from 'rxjs';

import { BookCardComponent } from '../book-card/book-card';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    BookCardComponent,
    BorrowAction
  ],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  books$!: Observable<Book[]>;
  isLoggedIn$!: Observable<boolean>;
  
  // Return search to its "Old" Subject state
  private search$ = new Subject<string>();
  // Keep Category as a BehaviorSubject
  private category$ = new BehaviorSubject<string>('all');
  private refresh$ = new BehaviorSubject<void>(void 0); 
  private destroy$ = new Subject<void>();

  selectedBookId: number | null = null;
  showConfirm = false;

  constructor(
    private bookService: BookService,
    private issueService: IssueService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.currentUser$.pipe(map(user => !!user));

    // REVERTED SEARCH LOGIC + INTEGRATED CATEGORY
    this.books$ = this.search$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query =>
        // Listen to refresh AND category changes together
        combineLatest([this.refresh$, this.category$]).pipe(
          switchMap(([_, category]) => 
            // Call the old service search logic
            (query ? this.bookService.search(query) : this.bookService.getAll()).pipe(
              // Apply the local category filter to the returned results
              map(books => this.filterByCategory(books, category))
            )
          )
        )
      ),
      takeUntil(this.destroy$)
    );
  }

  // Purely Category Filtering (Keep it simple)
private filterByCategory(books: Book[], category: string): Book[] {
  if (category === 'all') return books;
  
  return books.filter(book => {
    console.log(`Comparing Book Category: "${book.category}" with Selected: "${category}"`);
    return book.category?.toLowerCase() === category.toLowerCase();
  });
}

  // Old Search Handler restored
  onSearch(value: string): void {
    this.search$.next(value.trim());
  }

  // New Category Handler kept
  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.category$.next(value);
  }

  public triggerRefresh(): void {
    this.refresh$.next();
  }


  // ----------------------------------
  // LIFECYCLE HOOKS
  // ----------------------------------

  ngAfterViewInit(): void {
    // Programmatically focus the search input after view is ready
    this.focusSearchInput();
  }

  // ----------------------------------
  // SEARCH HANDLER
  // ----------------------------------


  private focusSearchInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  // ----------------------------------
  // BORROW FLOW
  // ----------------------------------

  onBorrow(bookId: number): void {
    this.selectedBookId = bookId;
    this.showConfirm = true;
  }

  confirmBorrow(): void {
    if (!this.selectedBookId) return;

    this.issueService.borrowBook(this.selectedBookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.refresh$.next(); // Refresh the book list
          this.resetDialog();
        },
        error: () => {
          alert('Unable to borrow book.');
          this.resetDialog();
        }
      });
  }

  cancelBorrow(): void {
    this.resetDialog();
  }

  private resetDialog(): void {
    this.showConfirm = false;
    this.selectedBookId = null;
  }

  // ----------------------------------
  // HELPERS
  // ----------------------------------

  trackById(index: number, book: Book): number {
    return book.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}