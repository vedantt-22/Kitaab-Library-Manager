import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./book-list/book-list').then(m => m.BookListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./book-detail/book-detail').then(m => m.BookDetailComponent)
  }
];