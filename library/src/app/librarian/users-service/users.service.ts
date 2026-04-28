import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = 'http://localhost:3001/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('UserService error:', error);
          return throwError(() => error);
        })
      );
  }

  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, updates)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('UserService update error:', error);
          return throwError(() => error);
        })
      );
  }

  deactivateUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('UserService deactivate error:', error);
          return throwError(() => error);
        })
      );
  }
}