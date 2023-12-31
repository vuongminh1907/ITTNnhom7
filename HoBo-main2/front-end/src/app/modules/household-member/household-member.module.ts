import { HouseholdMemberGuard } from './../../guards/household-member.guard';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HousholdMemberListComponent } from './houshold-member-list/houshold-member-list.component';
import { HouseholdMemberInfoComponent } from './household-member-info/household-member-info.component';
import { HouseholdMemberEditComponent } from './household-member-edit/household-member-edit.component';
import { HouseholdMemberAddComponent } from './household-member-add/household-member-add.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralComponent } from './general/general.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { KhaiTuListComponent } from './khai-tu-list/khai-tu-list.component';
import { KhaiTuAddComponent } from './khai-tu-add/khai-tu-add.component';
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TamTruListComponent } from './tam-tru-list/tam-tru-list.component';
import { KhaiTuInfoComponent } from './khai-tu-info/khai-tu-info.component';
import { TamTruAddComponent } from './tam-tru-add/tam-tru-add.component';
import { TamTruInfoComponent } from './tam-tru-info/tam-tru-info.component';
import { TamVangListComponent } from './tam-vang-list/tam-vang-list.component';
import { TamVangAddComponent } from './tam-vang-add/tam-vang-add.component';
import { TamVangInfoComponent } from './tam-vang-info/tam-vang-info.component'

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
  },
  {
    path: 'add',
    component: HouseholdMemberAddComponent,
    canDeactivate: [HouseholdMemberGuard]
  },
  {
    path: 'edit/:id',
    component: HouseholdMemberEditComponent,
    canDeactivate: [HouseholdMemberGuard]
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
    MatAutocompleteModule,
    ScrollingModule
  ],
  declarations: [
    HousholdMemberListComponent,
    HouseholdMemberInfoComponent,
    HouseholdMemberEditComponent,
    HouseholdMemberAddComponent,
    GeneralComponent,
    KhaiTuListComponent,
    KhaiTuAddComponent,
    TamTruListComponent,
    KhaiTuInfoComponent,
    TamTruAddComponent,
    TamTruInfoComponent,
    TamVangListComponent,
    TamVangAddComponent,
    TamVangInfoComponent
  ],
  exports: [RouterModule],
  providers: [
    ToastrService,
    HouseholdMemberGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'vi'},
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useValue: MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
     },
  ],
  entryComponents: [ KhaiTuAddComponent]
})
export class HouseholdMemberModule {

}
