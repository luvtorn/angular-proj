import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3000/api';
  private _user$ = new BehaviorSubject<any>(null); // текущее состояние пользователя
  public user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/rejestracja`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/logowanie`, data, { withCredentials: true });
  }

  updateUser(user: any) {
    this._user$.next(user);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.api}/logout`, { withCredentials: true });
  }

  checkUser(email: string) {
    return this.http.get(`${this.api}/check-user?email=${encodeURIComponent(email)}`, {
      withCredentials: true,
    });
  }

  editProfile(data: any, userId: string): Observable<any> {
    console.log('Editing profile for user ID:', userId);
    return this.http.put(`${this.api}/users/${userId}`, data, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          this.updateUser(res.user);
        })
      );
  }

  fetchUser() {
    return this.http.get(`${this.api}/auth/me`, { withCredentials: true }).pipe(
      tap((res: any) => {
        this._user$.next(res.user);
      })
    );
  }
}
