import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BatBuocService {
  constructor(private http: HttpClient) {
  }

// Lay toan bo thong tin phi bat buoc voi thang nam
  getAllBatBuoc(params : any) {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_dong_gop/get_households/`,params)
      .pipe(map((data) => {
        return data;
      }));
  }

  // Theo thang nam
  getBatBuocById(id: any, params: any) {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_dong_gop/get_fee_household/${id}/`,params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteHoDongGopsById(id: any, params: any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_dong_gop/delete_fee_household/${id}`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  searchBatBuoc(params: any) {
    return this.http.get<any>(`${environment.apiUrl}/household_member/search_household_members/`,params)
    .pipe(map((data: any) => {
      return data;
    }));
  }

  // Thêm khoản phí bắt buộc
  createBatBuoc(params:any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_dong_gop/update_fee_household/`,params)
    .pipe(map((data) => {
      return data;
    }));
  }


}
