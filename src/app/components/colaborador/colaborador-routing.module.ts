import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ColaboradorComponent } from './colaborador.component';


const jobRoutes: Routes = [
  {
    path: '',
    component: ColaboradorComponent,
  },

  {
    path: ':id',
    component: NewComponent,
  },
  {
    path: 'create',
    component: DetailComponent,
  },
  {
    path: 'edit/:id',
    component: EditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(jobRoutes)],
  exports: [RouterModule],
})
export class ColaboradorRoutingModule {}
