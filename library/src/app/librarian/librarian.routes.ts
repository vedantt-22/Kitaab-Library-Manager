import { Routes } from '@angular/router';


export const LIBRARIAN_ROUTES: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },

  {
    path: 'books',
    loadComponent: () =>
      import('./manage-books/book-list-admin/book-list-admin')
        .then(m => m.BookListAdminComponent)
  },

  {
    path: 'books/new',
    loadComponent: () =>
      import('./manage-books/book-form/book-form')
        .then(m => m.BookFormComponent)
  },

  {
    path: 'books/edit/:id',
    loadComponent: () =>
      import('./manage-books/book-form/book-form')
        .then(m => m.BookFormComponent)
  },

  {
    path: 'users',
    loadComponent: () =>
      import('./manage-users/user-list/user-list')
        .then(m => m.UserListComponent)
  }

];