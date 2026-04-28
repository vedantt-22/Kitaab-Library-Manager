import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { FinesResponse, FinePreview } from '../models/fine.model';

@Injectable({
  providedIn: 'root'
})
export class FineService {
  private readonly API_URL = 'http://localhost:3001/api/fines';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Fetches the full fine summary for the current user
   */
  getMyFines(): Observable<FinesResponse> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) return throwError(() => new Error('User not logged in'));
        return this.http.get<FinesResponse>(`${this.API_URL}/user/${user.id}`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Pays a fine for an ALREADY returned book
   */
  payFine(issueId: number): Observable<any> {
    // Matches Express: router.post('/pay/:issueId', ...)
    return this.http.post<any>(`${this.API_URL}/pay/${issueId}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * NEW: Handles returning the book and clearing the fine in one go
   */
  returnAndPay(issueId: number): Observable<any> {
    // Matches Express: router.post('/return/:issueId', ...)
    return this.http.post<any>(`${this.API_URL}/return/${issueId}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets a preview of the fine amount before returning
   */
  previewFine(issueId: number): Observable<FinePreview> {
    return this.http.get<FinePreview>(`${this.API_URL}/calculate/${issueId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // This will help you see if it's a 404 (URL mismatch) or 500 (Server crash)
    console.error('FineService error:', error);
    return throwError(() => error);
  }
}