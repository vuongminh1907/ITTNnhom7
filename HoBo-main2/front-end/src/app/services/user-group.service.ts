import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  constructor(private http: HttpClient) {
  }

  getAllGroups() {
    return this.http.get<any>(`${environment.apiUrl}/user_group/get_groups/`)
      .pipe(map((data) => {
        return data;
      }));
  }

  getGroupById(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/user_group/get_group/${id}/`)
    .pipe(map((data) => {
      return data;
    }));
  }

  deleteGroups(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/user_group/delete_groups/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  updateGroup(id: any, params: any) {
    return this.http.put<any>(`${environment.apiUrl}/user_group/update_group/${id}/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  createGroup(params: any) {
    return this.http.post<any>(`${environment.apiUrl}/user_group/create_group/`, params)
    .pipe(map((data) => {
      return data;
    }));
  }

  getRoles() {
    return this.http.get<any>(`${environment.apiUrl}/user_group/get_role_list/`)
    .pipe(map((data) => {
      return data;
    }));
  }
}
