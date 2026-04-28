import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';

/* =========================================
   DASHBOARD STATS (Matches Backend Exactly)
========================================= */

export interface DashboardStats {

  books: {
    totalBooks: number;
    uniqueTitles: number;
    availableBooks: number;
    issuedBooks: number;
    utilizationRate: number;
  };

  users: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersWithBooks: number;
  };

  issues: {
    totalIssued: number;
    activeIssues: number;
    overdueIssues: number;
    returnedIssues: number;
    overdueRate: number;
  };

  fines: {
    totalUnpaidFines: number;
    totalPaidFines: number;
    usersWithFines: number;
  };
}

/* =========================================
   OVERDUE REPORT (Matches Backend Exactly)
   GET /api/reports/overdue
========================================= */

export interface OverdueReportResponse {
  summary: {
    totalOverdue: number;
    totalFinesAccrued: number;
    unpaidFinesCount: number;
  };
  overdueIssues: OverdueIssue[];
}

export interface OverdueIssue {
  issueId: number;
  book: {
    id: number;
    title: string;
    isbn: string;
  };
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
  };
  issueDate: string;
  dueDate: string;
  daysOverdue: number;
  currentFine: number;
  finePaid: boolean;
}

/* =========================================
   POPULAR BOOKS REPORT
   GET /api/reports/popular
========================================= */

export interface PopularBooksResponse {
  mostPopular: PopularBook[];
  leastPopular: PopularBook[];
}

export interface PopularBook {
  id: number;
  title: string;
  author: string;
  category: string;
  timesIssued: number;
  currentlyIssued: number;
  availableCopies: number;
  totalCopies: number;
}

/* =========================================
   SERVICE
========================================= */

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private readonly API_URL = 'http://localhost:3001/api/stats';

  constructor(private http: HttpClient) {}

  /* -------- Dashboard -------- */

  getDashboardStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.API_URL}/dashboard`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Dashboard stats error:', error);
          return throwError(() => error);
        })
      );
  }

  /* -------- Overdue Report -------- */

  getOverdueReport(): Observable<OverdueReportResponse> {
    return this.http
      .get<OverdueReportResponse>(`${this.API_URL}/reports/overdue`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Overdue report error:', error);
          return throwError(() => error);
        })
      );
  }

  /* -------- Popular Books -------- */

  getPopularBooks(): Observable<PopularBooksResponse> {
    return this.http
      .get<PopularBooksResponse>(`${this.API_URL}/reports/popular`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Popular books error:', error);
          return throwError(() => error);
        })
      );
  }
}