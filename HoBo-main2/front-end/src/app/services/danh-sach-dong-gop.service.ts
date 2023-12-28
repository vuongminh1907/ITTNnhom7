import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DanhSachDongGopService {
  constructor(private http: HttpClient) {
  }

  getAllHoDongGops() {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_dong_gop/get_households/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getHoDongGopById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_dong_gop/get_fee_household/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  // Thêm khoản đóng góp cho hộ có id
  createHoDongGopById(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/danh_sach_dong_gop/update_fee_household/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteHoDongGopsById(id: any, params: any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_dong_gop/delete_fee_household/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

}
