import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  createMeeting(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/cuoc_hop/tao_moi_cuoc_hop`, params)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllMeetings() {
    return this.http.get<any>(`${environment.apiUrl}/cuoc_hop/xem_cuoc_hops/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getMeetingById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/cuoc_hop/xem_cuoc_hop/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  updateMeeting(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/cuoc_hop/sua_cuoc_hop/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteMeetings(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/cuoc_hop/xoa_cuoc_hop/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }
}
