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

   // Thêm khoản phí bắt buộc
   createBatBuoc( params:any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_bat_buoc/create_bat_buoc/`,params)
    .pipe(map((data) => {
      return data;
    }));
  }

// Lay toan bo thong tin phi bat buoc voi thang nam
  getAllBatBuoc() {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_bat_buoc/get_danh_sachs/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  searchMonthYear(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_bat_buoc/search_month_year/`,params)
    .pipe(map((data: any) => {
      return data;
    }));
  }

  getFileExcel(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_bat_buoc/upload_and_statistics_file_excel/`,params)
    .pipe(map((data: any) => {
      return data;
    }));
  }


  // Theo thang nam
  getBatBuocById(ma_ho_khau: any, searchMonth : any, searchYear: any) {
    return this.http.get<any>(`${environment.apiUrl}/danh_sach_bat_buoc/get_danh_sach/${ma_ho_khau}/${searchMonth}/${searchYear}/`)
    .pipe(map((data:any) => {
      return data;
    }));
  }

  // Theo thang nam
  updateBatBuocById(ma_ho_khau: any, searchMonth : any, searchYear: any, params :any) {
    return this.http.put<any>(`${environment.apiUrl}/danh_sach_bat_buoc/update_bat_buoc/${ma_ho_khau}/${searchMonth}/${searchYear}/`,params)
    .pipe(map((data:any) => {
      return data;
    }));
  }


  

 

  // Them dien nuoc tung ho khau
  createDienNuoc(id: any , params:any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_dong_gop/update_fee_household/${id}/`,params)
    .pipe(map((data) => {
      return data;
    }));
  }

   // Thêm khoản phí bắt buộc
   addMoney( id :any , params:any) {
    return this.http.post<any>(`${environment.apiUrl}/danh_sach_dong_gop/update_fee_household/${id}/`,params)
    .pipe(map((data) => {
      return data;
    }));
  }




}
