import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private api = 'http://localhost:3000/books';
  private _books$ = new BehaviorSubject<any>(null);
  public books$ = this._books$.asObservable();

  constructor(private http: HttpClient) {}

  fetchBooks(page: number = 1): Observable<any> {
    return this.http.get(`${this.api}/books?page=${page}`, { withCredentials: true }).pipe(
      tap((res: any) => {
        this._books$.next(res.books);
      })
    );
  }

  fetchBookById(bookId: string): Observable<any> {
    return this.http.get(`${this.api}/book/${bookId}`, { withCredentials: true });
  }
}
