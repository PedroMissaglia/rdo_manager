import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from '../../guard/auth.guard';
import { ClientComponent } from './client.component';


const jobRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'client/create',
    component: NewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/:id',
    component: DetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client/edit/:id',
    component: EditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(jobRoutes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
