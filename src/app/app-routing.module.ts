import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import your components here
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'jobs',  loadChildren: () => import('./job/job-routing.module').then(m => m.JobRoutingModule)},
  {path: 'collaborators',  loadChildren: () => import('./colaborador/colaborador-routing.module').then(m => m.ColaboradorRoutingModule)},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
