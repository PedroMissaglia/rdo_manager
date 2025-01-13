import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { JobComponent } from './job.component';


const jobRoutes: Routes = [
  {
    path: '',
    component: JobComponent,
  },
  {
    path: 'job/:id',
    component: DetailComponent,
  },
  {
    path: 'job/create',
    component: NewComponent,
  },
  {
    path: 'job/edit/:id',
    component: EditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(jobRoutes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
