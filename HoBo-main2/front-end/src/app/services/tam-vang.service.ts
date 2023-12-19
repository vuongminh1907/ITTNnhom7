import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TamVangService {
  constructor(private http: HttpClient) {
  }

  getAllTamVangs() {
    return this.http.get<any>(`${environment.apiUrl}/tam_vang/get_tam_vangs/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getTamVangById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/tam_vang/get_tam_vang/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  createTamVang(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/tam_vang/create_tam_vang/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteTamVangs(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/tam_vang/delete_tam_vangs/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  // updateTamTru(id: any, params: any) {
  //   return this.http.put<any>(`${environment.apiUrl}/tam_vang/update_tam_vang/${id}/`, params)
  //   .pipe(map((data) => {
  //     return data;
  //   }));
  // }
}
