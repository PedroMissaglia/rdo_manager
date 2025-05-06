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
    {property: 'placa', label: 'Placa', disabled: true},
    {property: 'dataInicioDisplay', label: 'Data', disabled: true},
    {property: 'horasPrevistas', label: 'Horas previstas', disabled: true},
    {property: 'horasRealizadas', label: 'Horas executadas', disabled: true},
    {property: 'responsavel', label: 'Responsável', gridColumns: 8},
    {property: 'aprovacaoFiscal', label: 'Aprovação do fiscal',  type: 'boolean', booleanFalse: 'Não aprovado', booleanTrue: 'Aprovado'},
    {property: 'aprovacaoCliente', label: 'Aprovação do cliente',  type: 'boolean', booleanFalse: 'Não aprovado', booleanTrue: 'Aprovado'},
    {property: 'responsavel', label: 'Responsável', gridColumns: 8},
    {property: 'justificativa', label: 'Justificativa', rows: 4, gridColumns: 12}
  ];

  constructor(
    private dailyReportService: DailyReportService,
    private notificationService: PoNotificationService,
    private crudService: CrudService,
    private router: Router) {}

  ngOnInit() {
    this.value = this.dailyReportService.itemFilteredByPlate;
  }

  onHandleGoBack() {
    this.router.navigate([`home`]);
  }

  substituirNoPai(pai: any, filho: any) {
    // Acessa o array dailyReport do pai
    for (let i = 0; i < pai.dailyReport.length; i++) {
      const reportPai = pai.dailyReport[i];

      // Verifica se o user e dataInicioDisplay são iguais
      if (reportPai.user === filho.user && reportPai.dataInicioDisplay === filho.dataInicioDisplay) {
        // Substitui o dailyReport do pai pelo do filho
        pai.dailyReport[i] = filho.dailyReport[0];  // Como o filho tem um único item, substituímos diretamente.
        break;  // Sai do loop após a substituição
      }
    }
  }

  async onHandleSave() {

    this.dailyReportService.itemFilteredByPlate['info'] = 'justified';
    this.substituirNoPai(this.dailyReportService.item, this.dailyReportService.itemFilteredByPlate)

    if (this.dailyReportService.item['$selected']) {
      delete this.dailyReportService.item['$selected'];
    }

    const updatedItem = await this.crudService.updateItem(
      'rdo',
      this.dailyReportService.item['id'],
      this.dailyReportService.item
    );

    if (updatedItem) {
      this.notificationService.success('Colaborador alterado com sucesso.');
      this.router.navigate(['home']);
    }
  }
}
