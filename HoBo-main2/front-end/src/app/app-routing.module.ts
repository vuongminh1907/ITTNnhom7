import { NotFoundComponent } from './modules/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { SignupComponent } from './modules/signup/signup.component';
// import { UserListComponent } from './modules/admin/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: 'household-member',
        loadChildren: () => import('./modules/household-member/household-member.module').then((m) => m.HouseholdMemberModule)
      },
      {
        path: 'household-book',
        loadChildren: () => import('./modules/household-book/household-book.module').then((m) => m.HouseholdBookModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule)
        // children: [
        //   {
        //     path: 'user-list',
        //     component: UserListComponent
        //   }
        // ]
      },
      {
        path: 'meeting',
        loadChildren: () => import('./modules/meeting/meeting.module').then((m) => m.MeetingModule)
      },
      {
        path: 'household-evaluation',
        loadChildren: () => import('./modules/household-evaluation/household-evaluation.module').then((m) => m.HouseholdEvaluationModule)
      },
      {
        path: 'statistics',
        loadChildren: () => import('./modules/statistics/statistics.module').then((m) => m.StatisticsModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
