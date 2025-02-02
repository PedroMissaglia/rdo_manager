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
    {
      property: 'total_de_horas',
      label: 'Total de horas',
      divider: 'Detalhes do dia na obra',
      gridColumns: 4,
      order: 1,
    },
    { property: 'horasPrevistas', label: 'Horas previstas', gridColumns: 4 },
    { property: 'status', label: 'Status do dia', gridColumns: 4 },
    { property: 'tipo_de_servico', label: 'Tipo de serviço', gridColumns: 4 },
    { property: 'locomocao', label: 'Locomoção', gridColumns: 4 },
    { property: 'manutencao', label: 'Manutenção', gridColumns: 4 },
    { property: 'obra', label: 'Obra', gridColumns: 4 },
    { property: 'endereco', label: 'Endereço', gridColumns: 12 },
    { property: 'placa', label: 'Placa', gridColumns: 4 },
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
