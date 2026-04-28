import { Routes } from '@angular/router';

export const MY_BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./my-books').then(m => m.MyBooksComponent)
  }
];