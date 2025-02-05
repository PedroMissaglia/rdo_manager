import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ColaboradorComponent } from './colaborador.component';
import { AuthGuard } from '../../guard/auth.guard';


const jobRoutes: Routes = [
  {
    path: '',
    component: ColaboradorComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'collaborator/create',
    component: NewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'collaborator/:id',
    component: DetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'collaborator/edit/:id',
    component: EditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(jobRoutes)],
  exports: [RouterModule],
})
export class ColaboradorRoutingModule {}
