import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  public login(user: Omit<User, 'name'>): Observable<{ data: { token: string } }> {
    return this.http.post<{ data: { token: string } }>(`${this.apiUrl}/login`, user);
  }

  public register(user: User): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.apiUrl}/register`, user);
  }

}
