import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Observable,
  catchError,
  throwError,
  map
} from 'rxjs';

import { Book } from '../models/book.model';

/* Raw shape returned by backend */
interface BookApiResponse {
  id: number;
  title: string;
  body: string;
  isbn: string;
  publishedYear: number;
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  addedDate: string;
  addedBy: string;
}

interface BookWrappedResponse {
  message: string;
  book: BookApiResponse;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly API_URL = 'http://localhost:3001/api/books';

  constructor(private http: HttpClient) {}

  // ==========================
  // MAP BACKEND → FRONTEND
  // ==========================

  private mapBook(book: BookApiResponse): Book {
    return {
      id: book.id,
      title: book.title,
      description: book.body,
      author: '',
      isbn: book.isbn,
      publisher: '',
      publishedYear: book.publishedYear,
      publishedDate: '',
      category: book.category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      issuedCopies: book.issuedCopies,
      addedDate: book.addedDate,
      addedBy: book.addedBy,
      position: ''
    };
  }

  /*
   GET ALL
  */

  getAll(): Observable<Book[]> {
    return this.http
      .get<BookApiResponse[]>(`${this.API_URL}/detailed`)
      .pipe(
        map(books => books.map(b => this.mapBook(b))),
        catchError(error => {
          console.error('GET ALL ERROR:', error);
          return throwError(() => error);
        })
      );
  }

  /*
   GET BY ID
  */

  getById(id: number): Observable<Book> {
    return this.http
      .get<BookApiResponse>(`${this.API_URL}/detailed/${id}`)
      .pipe(
        map(book => this.mapBook(book)),
        catchError(error => {
          console.error('GET BY ID ERROR:', error);
          return throwError(() => error);
        })
      );
  }

/*
  SEARCH
*/

  search(query: string): Observable<Book[]> {

    const params = new HttpParams().set('q', query);

    return this.http
      .get<BookApiResponse[]>(`${this.API_URL}/search`, { params })
      .pipe(
        map(books => books.map(b => this.mapBook(b))),
        catchError(error => {
          console.error('SEARCH ERROR:', error);
          return throwError(() => error);
        })
      );
  }

/*
  CREATE
*/

  create(book: Partial<Book>): Observable<Book> {

    const payload = {
      title: book.title,
      author: book.author,
      body: book.description,
      isbn: book.isbn,
      category: book.category,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies
    };

    return this.http
      .post<BookWrappedResponse>(`${this.API_URL}/create`, payload)
      .pipe(
        map(res => this.mapBook(res.book)),
        catchError(error => {
          console.error('CREATE ERROR:', error);
          return throwError(() => error);
        })
      );
  }

/*
  UPDATE
*/

  update(id: number, book: Partial<Book>): Observable<Book> {

    const payload = {
      title: book.title,
      body: book.description,
      category: book.category,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies
    };

    return this.http
      .put<BookWrappedResponse>(`${this.API_URL}/${id}/update`, payload)
      .pipe(
        map(res => this.mapBook(res.book)),
        catchError(error => {
          console.error('UPDATE ERROR:', error);
          return throwError(() => error);
        })
      );
  }

  /*
  DELETE
  */

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}/delete`)
      .pipe(
        catchError(error => {
          console.error('DELETE ERROR:', error);
          return throwError(() => error);
        })
      );
  }
}