import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private userSubject: BehaviorSubject<User | null>;
  // public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    // this.userSubject = new BehaviorSubject<User | null>(
    //   JSON.parse(localStorage.getItem('currentUser') || '{}')
    // );
    // this.user = this.userSubject.asObservable();
  }

  // public get userValue(): User | null {
  //   return this.userSubject.value;
  // }

  login(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, params)
      .pipe(
        map((user) => {
          // this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    // this.userSubject.next(null);
    this.router.navigate(['/']);
    return this.http.post<any>(`${environment.apiUrl}/auth/logout`, null)
  }

  isLoggedIn() {
    return this.http.get<any>(`${environment.apiUrl}/auth/is_logged_in/`)
    .pipe(
      map((res) => {
        console.log(res)
        return res;
      })
    );
  }
}
