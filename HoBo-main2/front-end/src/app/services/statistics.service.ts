import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private http: HttpClient,
  ) { }

  getDashboard() {
    return this.http.get<any>(`${environment.apiUrl}/statistics/dashboard/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getHouseholdMemberStatistics(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/statistics/thong_ke_nhan_khau/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }
}
