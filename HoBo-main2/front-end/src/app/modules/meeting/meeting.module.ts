import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes } from '@angular/router';
import { MeetingAddComponent } from './meeting-add/meeting-add.component';
import { MatButtonModule } from '@angular/material/button';
import { MeetingInfoComponent } from './meeting-info/meeting-info.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSortModule } from '@angular/material/sort';
import { NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatExpansionModule } from '@angular/material/expansion';
import { MeetingAttendantsComponent } from './meeting-attendants/meeting-attendants.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MeetingOwnerComponent } from './meeting-owner/meeting-owner.component';


const routes: Routes = [
  {
    path: '',
    component: MeetingListComponent,
  },
  {
    path: 'detail/:id',
    component: MeetingInfoComponent,
  }
];

const CUSTOM_PARSE_DATE_INPUT = 'l, LTS';
const CUSTOM_DISPLAY_DATE_INPUT = 'DD-MM-YYYY, HH:mm';

// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: CUSTOM_PARSE_DATE_INPUT
  },
  display: {
    dateInput: CUSTOM_DISPLAY_DATE_INPUT,
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@NgModule({
  declarations: [
    MeetingListComponent,
    MeetingInfoComponent,
    MeetingAddComponent,
    MeetingAttendantsComponent,
    MeetingOwnerComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgxDatatableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSortModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule,
    MatExpansionModule,
    MatSlideToggleModule,
    FormsModule
  ],
  providers: [
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class MeetingModule { }
