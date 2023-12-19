import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingAttendantsService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  addMeetingAttendants(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/danh_sach_tham_du/them_nguoi_tham_du/`, params)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteMeetingAttendants(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_tham_du/xoa_nguoi_tham_du/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  addMeetingInvited(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/moi_hop/them_loi_moi/`, params)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteMeetingInvited(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/moi_hop/xoa_loi_moi/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  getMeetingInvited(id_cuoc_hop: any) {
    return this.http.get<any>(`${environment.apiUrl}/moi_hop/xem_danh_sach_moi_hop/${id_cuoc_hop}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  getMeetingNotInvited(id_cuoc_hop: any) {
    return this.http.get<any>(`${environment.apiUrl}/moi_hop/xem_danh_sach_chua_moi_hop/${id_cuoc_hop}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  getMeetingAttendants(id_cuoc_hop: any) {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_tham_du/xem_danh_sach_tham_du/${id_cuoc_hop}/`)
    .pipe(map((data) => {
      return data;
    }));
  }
}
