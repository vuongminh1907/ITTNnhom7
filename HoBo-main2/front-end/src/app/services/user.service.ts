import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  registerUser(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/register/`, params)
      .pipe(
        catchError(this.errorHandler.handleError),
        map((user) => {
          return user;
        })
      );
  }

  getAllUsers() {
    return this.http.get<any>(`${environment.apiUrl}/user/get_users/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getUserById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/user/get_user/${id}/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  deleteUsers(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/user/delete_users/`, params)
      .pipe(map((data) => {
        return data;
      }));
  }

  updateUser(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/user/update_user/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  getMyInfo() {
    return this.http.get<any>(`${environment.apiUrl}/user/get_my_info/`)
    .pipe(map((data) => {
      return data;
    }));
  }

}
