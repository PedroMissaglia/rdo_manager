import { Component } from '@angular/core';
import { PoDynamicFormField } from '@po-ui/ng-components';
import { JobService } from '../job.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit',
    standalone: false,
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss'
})
export class EditComponent {

  value: any;
  fields: Array<PoDynamicFormField> = [
    { property: 'id', divider: 'detalhes', order: 1, disabled: true, gridColumns: 4 },
    { property: 'nome', label: 'Serviço', gridColumns: 8 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12, rows: 3 },
  ];

  constructor(
    private jobService: JobService,
    private router: Router) {}

  ngOnInit() {
    this.value = this.jobService.job;
  }

  onHandleGoBack() {
    this.router.navigate([`jobs`]);
  }

}
