import { PoBreadcrumb, PoDynamicViewField } from '@po-ui/ng-components';
import { DailyReportService } from './../daily-report.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-daily-report',
  templateUrl: './detail-daily-report.component.html',
  styleUrl: './detail-daily-report.component.scss',
  standalone: false,
})
export class DetailDailyReportComponent implements OnInit {
  fields: Array<PoDynamicViewField> = [
    {property: 'obra', label: 'Cliente'},
    {property: 'placa', label: 'Placa'},
    {property: 'dataInicioDisplay', label: 'Data'},
    {property: 'horasPrevistas', label: 'Horas previstas'},
    {property: 'horasRealizadas', label: 'Horas realizadas'},
    {property: 'justificativa', label: 'Justificativa'}
  ];
  constructor(
    public dailyReportService: DailyReportService,
    private router: Router) {}

  ngOnInit(): void {
    this.dailyReportService.item;

  }

  onHandleGoBack() {
    this.router.navigate([`home`]);
  }

  onHandleGoEdit() {}
}
