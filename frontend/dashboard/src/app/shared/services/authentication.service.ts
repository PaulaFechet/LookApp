import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUser } from '../models/user'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private endpoint: string = 'https://localhost:44387/api/authentication';
  private currentUserSubject: BehaviorSubject<LoggedInUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<LoggedInUser>(JSON.parse(localStorage.getItem('currentUser')));
  }

  public get currentUserValue(): LoggedInUser {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.endpoint}/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }))
  }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(`${this.endpoint}/register`, { username, email, password })
      .pipe(map(user => {
        return user;
      }))
  }


  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
