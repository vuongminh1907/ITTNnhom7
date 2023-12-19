import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TamTruService {
  constructor(private http: HttpClient) {
  }

  getAllTamTrus() {
    return this.http.get<any>(`${environment.apiUrl}/tam_tru/get_tam_trus/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getTamTruById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/tam_tru/get_tam_tru/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  createTamTru(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/tam_tru/create_tam_tru/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  updateTamTru(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/tam_tru/update_tam_tru/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteTamTrus(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/tam_tru/delete_tam_trus/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }
}
