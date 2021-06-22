import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { LoggedInUser } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public loggedInUser: LoggedInUser;

  private readonly endpoint: string = 'https://localhost:44387/api/authentication';

  constructor(private readonly http: HttpClient) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  }

  login(email: string, password: string): Observable<LoggedInUser> {
    return this.http.post<LoggedInUser>(`${this.endpoint}/login`, { email, password })
      .pipe(
        map(loggedInUser => {
          sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
          this.loggedInUser = loggedInUser;
          return loggedInUser;
        })
      );
  }

  register(username: string, email: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/register`, { username, email, password });
  }

  logout(): void {
    sessionStorage.removeItem('loggedInUser');
    this.loggedInUser = null;
  }
}
