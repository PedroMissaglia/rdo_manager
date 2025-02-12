import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { PoModule } from '@po-ui/ng-components';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ClientRoutingModule } from './client-routing.module';



@NgModule({
  declarations: [
    ClientComponent,
    DetailComponent,
    NewComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    PoModule,
    ClientRoutingModule,
  ],
  exports: [
    ClientComponent,
    DetailComponent,
    NewComponent,
    EditComponent
  ]
})
export class ClientModule { }
