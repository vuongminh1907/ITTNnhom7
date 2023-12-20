import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DongGopService {
  constructor(private http: HttpClient) {
  }

  getAllDongGops() {
    return this.http.get<any>(`${environment.apiUrl}/khoan_dong_gop/get_dong_gops/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getDongGopById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/khoan_dong_gop/get_dong_gop/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  createDongGop(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/khoan_dong_gop/create_khoan_phi/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteDongGops(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/khoan_dong_gop/delete_dong_gops/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

}
