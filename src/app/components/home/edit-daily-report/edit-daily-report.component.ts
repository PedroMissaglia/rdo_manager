import { Component } from '@angular/core';
import { DailyLogService } from '../../../services/daily-log.service';
import { PoDynamicFormField, PoDynamicViewField, PoNotificationService } from '@po-ui/ng-components';
import { CrudService } from '../../../services/crud.service';
import { Router } from '@angular/router';
import { DailyReportService } from '../daily-report.service';

@Component({
  selector: 'app-edit-daily-report',
  standalone: false,
  templateUrl: './edit-daily-report.component.html',
  styleUrl: './edit-daily-report.component.scss'
})
export class EditDailyReportComponent {

  value: any;
  fields: Array<PoDynamicFormField> = [
    {property: 'obra', label: 'Cliente', disabled: true},
    {property: 'placa', label: 'Placa', disabled: true},
    {property: 'dataInicioDisplay', label: 'Data', disabled: true},
    {property: 'horasPrevistas', label: 'Horas previstas', disabled: true},
    {property: 'horasRealizadas', label: 'Horas realizadas', disabled: true},
    {property: 'justificativa', label: 'Justificativa'}
  ];

  constructor(
    private dailyReportService: DailyReportService,
    private notificationService: PoNotificationService,
    private crudService: CrudService,
    private router: Router) {}

  ngOnInit() {
    this.value = this.dailyReportService.item;
  }

  onHandleGoBack() {
    this.router.navigate([`home`]);
  }

  async onHandleSave() {

    if (this.dailyReportService.item['$selected']) {
      delete this.dailyReportService.item['$selected'];
    }

    const updatedItem = await this.crudService.updateItem(
      'rdo',
      this.dailyReportService.item['id'],
      this.dailyReportService.item.collaborator
    );

    if (updatedItem) {
      this.notificationService.success('Colaborador alterado com sucesso.');
      this.router.navigate(['home']);
    }
  }
}
