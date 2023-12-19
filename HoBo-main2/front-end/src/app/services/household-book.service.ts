
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class HouseholdBookService {

  constructor(private http: HttpClient) {

  }

  createHousehold(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/household/create_household/`, params)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  splitHousehold(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/household/split_household/${id}/`, params)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  deleteHousehold(idList: any) {
    return this.http.post<any>(`${environment.apiUrl}/household/delete_households/`, idList)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getHouseholdById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/household/get_household/${id}/`)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getHouseholdHistory(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/household/get_household_history/${id}/`)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getAllHouseholds() {
    return this.http.get<any>(`${environment.apiUrl}/household/get_households/`)
    .pipe(map((data: any) => {
      return data;
    }));
  }

  updateHousehold(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/household/update_household/${id}/`, params)
    .pipe(map((data: any) => {
      return data;
    }));
  }
}

