import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserListComponent } from './user-list/user-list.component';
import { RoleGroupListComponent } from './role-group-list/role-group-list.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GroupInfoComponent } from './group-info/group-info.component';
import { MatSortModule } from '@angular/material/sort';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupAddComponent } from './group-add/group-add.component';

const routes: Routes = [
  {
    path: 'user-list',
    component: UserListComponent,
  },
  {
    path: 'role-group-list',
    component: RoleGroupListComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSortModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  declarations: [
    RoleGroupListComponent,
    UserListComponent,
    GroupInfoComponent,
    GroupEditComponent,
    GroupAddComponent
  ],
  exports: [RouterModule],
  providers: []
})
export class AdminModule {

}
