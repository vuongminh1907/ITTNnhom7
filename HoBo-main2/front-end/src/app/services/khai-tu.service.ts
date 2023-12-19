import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class KhaiTuService {
  constructor(private http: HttpClient) {
  }

  getAllKhaiTus() {
    return this.http.get<any>(`${environment.apiUrl}/khai_tu/get_khai_tus/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getKhaiTuById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/khai_tu/get_khai_tu/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  createKhaiTu(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/khai_tu/create_khai_tu/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteKhaiTu(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/khai_tu/delete_khai_tus/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }
}
