import { HouseholdMemberGuard } from '../../guards/household-member.guard';
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
import { DongGopListComponent } from './dong-gop-list/dong-gop-list.component';
import { DongGopAddComponent } from './dong-gop-add/dong-gop-add.component';
import { DongGopInfoComponent } from './dong-gop-info/dong-gop-info.component';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralComponent } from './general/general.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HouseholdDonateListComponent } from './household-donate-list/household-donate-list.component';
import { HouseholdDonateInfoComponent } from './household-donate-info/household-donate-info.component';
import { HouseholdDonateAddComponent } from './household-donate-add/household-donate-add.component';
import { HouseholdDonateDeleteComponent } from './household-donate-delete/household-donate-delete.component';
import { BatBuocListComponent } from './bat-buoc-list/bat-buoc-list.component';
//import { HouseholdInfoComponent } from './household-info/household-info.component';
//import { HouseholdAddComponent } from './household-add/household-add.component';
//import { HouseholdBookMemberComponent } from './household-book-member/household-book-member.component';
//import { HouseholdEditComponent } from './household-edit/household-edit.component';
import { BatBuocAddComponent } from './bat-buoc-add/bat-buoc-add.component';
import { BatBuocAddMoneyComponent } from './bat-buoc-add-money/bat-buoc-add-money.component';
import { BatBuocDienNuocComponent } from './bat-buoc-dien-nuoc/bat-buoc-dien-nuoc.component';
import { BatBuocInfoComponent } from './bat-buoc-info/bat-buoc-info.component';
const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
  },
  // {
  //   path: 'add',
  //   component: HouseholdMemberAddComponent,
  //   canDeactivate: [HouseholdMemberGuard]
  // },
  // {
  //   path: 'edit/:id',
  //   component: HouseholdMemberEditComponent,
  //   canDeactivate: [HouseholdMemberGuard]
  // }
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
    // HousholdMemberListComponent,
    // HouseholdMemberInfoComponent,
    // HouseholdMemberEditComponent,
    // HouseholdMemberAddComponent,
    DongGopListComponent,
    DongGopAddComponent,
    DongGopInfoComponent,
    HouseholdDonateListComponent,
    HouseholdDonateInfoComponent,
    HouseholdDonateAddComponent,
    HouseholdDonateDeleteComponent,
    BatBuocListComponent,
    BatBuocAddComponent,
    BatBuocAddMoneyComponent,
    BatBuocDienNuocComponent,
    BatBuocInfoComponent,
    GeneralComponent,
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
})
export class KhoanPhiModule {

}
