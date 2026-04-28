import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'library_token';
  private userKey = 'library_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  login(username: string, password: string)
  : Observable<{ message: string; token: string; user: User }> {

  return this.http.post<{ message: string; token: string; user: User }>(
    `${this.apiUrl}/login`,
    { username, password }
  ).pipe(
    tap(res => {
      this.storeSession(res.token, res.user);
    })
  );
}

  register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }): Observable<{ message: string; token: string; user: User }> {

    return this.http.post<{ message: string; token: string; user: User }>(
      `${this.apiUrl}/register`,
      data
    ).pipe(
      tap(res => {
        this.storeSession(res.token, res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLibrarian(): boolean {
    return this.currentUserSubject.value?.role === 'librarian';
  }

    get currentUser(): User | null {
  return this.currentUserSubject.value;
}

  private storeSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        // Update the BehaviorSubject and LocalStorage with the fresh data
        this.updateLocalUser(user);
      })
    );
  }

  // --- Helper to update local state without a full login ---
  private updateLocalUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  get currentUserValue(): User | null {
  return this.currentUserSubject.value;
}

  private restoreSession(): void {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.userKey);

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}