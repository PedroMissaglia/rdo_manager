import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailDailyReportComponent } from './components/home/detail-daily-report/detail-daily-report.component';
import { LoginComponent } from './components/login/login.component';
import { DailyLogComponent } from './components/daily-log/daily-log.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'detail/:id', component: DetailDailyReportComponent},
  {path: 'login', component: LoginComponent},
  {path: 'jobs',  loadChildren: () => import('./components/job/job-routing.module').then(m => m.JobRoutingModule)},
  {path: 'collaborators',  loadChildren: () => import('./components/colaborador/colaborador-routing.module').then(m => m.ColaboradorRoutingModule)},
  {path: 'dailyLog',  component: DailyLogComponent},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class AppRoutingModule {}
