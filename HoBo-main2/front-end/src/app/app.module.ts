import { MatNativeDateModule, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
// import { UserInfoModule } from './modules/user-info/user-info.module';
import { LayoutComponent } from './modules/layout/layout.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SignupComponent } from './modules/signup/signup.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientModule } from '@angular/common/http';
import { UserInfoComponent } from './modules/user-info/user-info.component';
// import { AdminModule } from './modules/admin/admin.module';
import { MatIconModule } from '@angular/material/icon'
import { httpInterceptorProviders } from './interceptors';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmPopupComponent } from './modules/confirm-popup/confirm-popup.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { Overlay, CloseScrollStrategy } from '@angular/cdk/overlay';
// import { HouseholdListComponent } from './modules/household-book/household-list/household-list.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';

export function scrollFactory(overlay: Overlay): () => CloseScrollStrategy {
    return () => overlay.scrollStrategies.close();
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LayoutComponent,
    NotFoundComponent,
    UserInfoComponent,
    ConfirmPopupComponent,
    // HouseholdListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    HttpClientModule,
    MatDialogModule,
    NgSelectModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    FontAwesomeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  providers: [
    httpInterceptorProviders,
    { provide: MAT_DATE_LOCALE, useValue: 'vi'},
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatGridListModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [UserInfoComponent, SignupComponent]
})
export class AppModule { }
