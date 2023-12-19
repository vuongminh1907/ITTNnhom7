import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingOwnerService {

  constructor(
    private http: HttpClient
  ) { }

  addMeetingOwners(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/nguoi_to_chuc/them_nguoi_to_chuc/`, params)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteMeetingOwners(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/nguoi_to_chuc/xoa_nguoi_to_chuc/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  getMeetingOwners(id_cuoc_hop: any) {
    return this.http.get<any>(`${environment.apiUrl}/nguoi_to_chuc/xem_danh_sach_nguoi_to_chuc/${id_cuoc_hop}/`)
    .pipe(map((data) => {
      return data;
    }));
  }
}
