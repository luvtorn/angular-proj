import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
private api = 'http://localhost:3000';

constructor(private http: HttpClient) {}

register(data:any): Observable<any> {
    return this.http.post(`${this.api}/rejestracja`, data);
}

login(data:any): Observable<any> {
    return this.http.post(`${this.api}/logowanie`, data, { withCredentials: true });
}

logout(): Observable<any> {
    return this.http.get(`${this.api}/logout`, { withCredentials: true });
}

checkUser(email:string){
    return this.http.get(`${this.api}/check-user?email=${encodeURIComponent(email)}`, { withCredentials: true });
}
}