import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailDailyReportComponent } from './components/home/detail-daily-report/detail-daily-report.component';
import { LoginComponent } from './components/login/login.component';
import { DailyLogComponent } from './components/daily-log/daily-log.component';
import { AuthGuard } from './guard/auth.guard';
import { EditDailyReportComponent } from './components/home/edit-daily-report/edit-daily-report.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'detail/:id', component: DetailDailyReportComponent,     canActivate: [AuthGuard]},
  {path: 'edit/:id', component: EditDailyReportComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'jobs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/job/job-routing.module').then(m => m.JobRoutingModule)},
  {
    path: 'collaborators',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/colaborador/colaborador-routing.module').then(m => m.ColaboradorRoutingModule)},
  {
    path: 'dailyLog',
    component: DailyLogComponent,
    canActivate: [AuthGuard]
  },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule {}
