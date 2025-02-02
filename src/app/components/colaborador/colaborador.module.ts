import { ColaboradorComponent } from './colaborador.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { NewComponent } from './new/new.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [
    ColaboradorComponent,
    NewComponent,
    DetailComponent,
    EditComponent
    ],
  imports: [
    CommonModule,
    PoModule
  ],
  exports: [
    ColaboradorComponent,
    NewComponent,
    DetailComponent,
    EditComponent
  ]
})
export class ColaboradorModule { }
