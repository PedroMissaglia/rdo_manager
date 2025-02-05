import { ColaboradorComponent } from './colaborador.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { NewComponent } from './new/new.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import { ColaboradorRoutingModule } from './colaborador-routing.module';



@NgModule({
  declarations: [
    ColaboradorComponent,
    NewComponent,
    DetailComponent,
    EditComponent
    ],
  imports: [
    CommonModule,
    PoModule,
    ColaboradorRoutingModule
  ],
  exports: [
    ColaboradorComponent,
    NewComponent,
    DetailComponent,
    EditComponent
  ]
})
export class ColaboradorModule { }
