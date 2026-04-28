import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { librarianGuard } from './auth/guards/librarian.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: 'books',
    loadChildren: () =>
      import('./books/books.routes').then(m => m.BOOKS_ROUTES)
  },

  {
  path: 'profile',
  loadComponent: () =>
    import('./shared/profile-component/profile-component')
      .then(m => m.ProfileComponent)
},

  {
    path: 'my-books',
    loadChildren: () =>
      import('./my-books/my-books.routes').then(m => m.MY_BOOKS_ROUTES),
    canActivate: [authGuard]
  },

  {
    path: 'librarian',
    loadChildren: () =>
      import('./librarian/librarian.routes').then(m => m.LIBRARIAN_ROUTES),
    canActivate: [authGuard, librarianGuard]
  },

  {
    path: '**',
    redirectTo: 'books'
  }

];