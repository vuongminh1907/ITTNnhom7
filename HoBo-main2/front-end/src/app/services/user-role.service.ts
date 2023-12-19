import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  constructor(private http: HttpClient) {
  }

  getAllRoles() {
    // return this.http.get<any>(`${environment.apiUrl}/user_group/get_groups/`)
    //   .pipe(map((data) => {
    //     return data;
    //   }));
  }
}
