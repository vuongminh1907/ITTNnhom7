import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingPaperService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  createMeetingPaper(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/bien_ban_hop/tao_moi_bien_ban_hop`, params)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getMeetingPaperById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/bien_ban_hop/xem_bien_ban_hop/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  getMeetingPaperByMeetingId(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/bien_ban_hop/xem_bien_ban_hop_by_id_cuoc_hop/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  updateMeetingPaper(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/bien_ban_hop/sua_bien_ban_hop/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteMeetingPapers(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/bien_ban_hop/xoa_bien_ban_hop/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  checkHasMeetingPaper(id_cuoc_hop: any) {
    return this.http.get<any>(`${environment.apiUrl}/bien_ban_hop/check_cuoc_hop_has_bien_ban_hop/${id_cuoc_hop}/`)
    .pipe(map((data) => {
      return data;
    }));
  }
}
