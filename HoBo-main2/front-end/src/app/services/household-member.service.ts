import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class HouseholdMemberService {

  constructor(private http: HttpClient) {

  }

  createHouseholdMember(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/household_member/create_household_member/`, params)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getHouseholdMember(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/household_member/get_household_member/${id}/`)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getAllHouseholdMember() {
    return this.http.get<any>(`${environment.apiUrl}/household_member/get_household_members/`)
    .pipe(map((data: any) => {
      return data;
    }));
  }

  updateHouseholdMember(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/household_member/update_household_member/${id}/`, params)
    .pipe(map((data: any) => {
      return data;
    }));
  }

  searchHouseholdMembers(field: any, query: any) {
    return this.http.get<any>(`${environment.apiUrl}/household_member/search_household_members/?field=${field}&query=${query}`)
    .pipe(map((data: any) => {
      return data;
    }));
  }

  searchHouseholdMemberByCmt(so_cmt:any) {
    return this.http.get<any>(`${environment.apiUrl}/household_member/get_household_member_by_cmt/?cmt=${so_cmt}`,)
    .pipe(map((data: any) => {
      return data;
    }));
  }
}
