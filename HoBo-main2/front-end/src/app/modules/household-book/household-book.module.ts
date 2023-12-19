import { HouseholdSplitComponent } from './household-split/household-split.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HouseholdListComponent } from './household-list/household-list.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { HouseholdInfoComponent } from './household-info/household-info.component';
import { HouseholdAddComponent } from './household-add/household-add.component';
import { HouseholdBookMemberComponent } from './household-book-member/household-book-member.component';
import { HouseholdEditComponent } from './household-edit/household-edit.component';


const routes: Routes = [
  {
    path: '',
    component: HouseholdListComponent
  },
  {
    path: 'add',
    component: HouseholdAddComponent
  },
  {
    path: 'edit/:id',
    component: HouseholdEditComponent
  },
  {
    path: 'split/:id',
    component: HouseholdSplitComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSortModule,
    ReactiveFormsModule,
    MatSelectModule,
    ToastrModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
    MatAutocompleteModule
  ],
  declarations: [
    HouseholdListComponent,
    HouseholdInfoComponent,
    HouseholdAddComponent,
    HouseholdBookMemberComponent,
    HouseholdEditComponent,
    HouseholdSplitComponent
  ],
  exports: [RouterModule],
  providers: [],
  entryComponents: []
})
export class HouseholdBookModule {

}
