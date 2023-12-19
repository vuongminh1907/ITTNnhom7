import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HouseholdEvaluationService {

  constructor(
    private http: HttpClient
  ) { }

  addHouseholdEvaluation(params: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/danh_gia/them_danh_gia/`, params)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getHouseholdEvaluation(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/danh_gia/xem_danh_gia/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  getAllHouseholdEvaluation() {
    return this.http.get<any>(`${environment.apiUrl}/danh_gia/xem_danh_gia_all/`)
    .pipe(map((data) => {
      return data;
    }));
  }
}
