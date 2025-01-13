import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobComponent } from './job.component';
import { PoModule, PoPageModule } from '@po-ui/ng-components';


@NgModule({
  declarations: [JobComponent],
  imports: [
    CommonModule,
    PoModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Add this line
  exports: [JobComponent]
})
export class JobModule { }
