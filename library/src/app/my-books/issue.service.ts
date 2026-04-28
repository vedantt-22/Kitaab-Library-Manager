import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  // Base URLs for the two different controllers
  private readonly ISSUES_URL = 'http://localhost:3001/api/issues';
  private readonly FINES_URL = 'http://localhost:3001/api/fines';

  constructor(private http: HttpClient) {}

  getMyIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.ISSUES_URL);
  }

  borrowBook(bookId: number): Observable<Issue> {
    // Matches router.post('/', ...) in issues.routes.js
    return this.http.post<Issue>(this.ISSUES_URL, { bookId });
  }

  returnBook(issueId: number): Observable<any> {
    /** * IMPORTANT: We use the FINES_URL here because our new route 
     * handles both the return and the fine payment settlement.
     * Also changed .put to .post to match your Express router.post
     */
    return this.http.post<any>(
      `${this.FINES_URL}/return/${issueId}`,
      {}
    );
  }

  renewBook(issueId: number): Observable<Issue> {
  return this.http.put<Issue>(
    `${this.ISSUES_URL}/${issueId}/renew`,
    {}
  );
}
}