import { DailyReportService } from './daily-report.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoPageAction, PoTableAction, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { CrudService } from '../../services/crud.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: false
})
export class HomeComponent implements OnInit{

  logo = '/assets/swl_logo.png';
  columns: Array<PoTableColumn> = this.getColumns();
  selectDailyReport: any;
  public actions: Array<PoPageAction> = [
    {
      label: 'Visualizar',
      action: this.redirectToDailyReportDetail.bind(this)
    }
  ];
  items: any;

  tableActions: Array<PoTableAction> = [
    {
      action: this.onShowMore.bind(this),
      icon: 'an an-file-pdf',
      label: ''
    }
  ];


  tableItems: Array<any> = [];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', action: this.beforeRedirect.bind(this)}]
  };

  constructor(
    private router: Router,
    private crudService: CrudService,
    private dailyReportService: DailyReportService) {}

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      this.items = await this.crudService.getItems('rdo') ?? [];

      this.calcularTotais(this.items);

      this.tableItems = this.items;
    }
      catch (error) {
      console.error('Error loading items:', error);
    }
  }

  calcularTotais(dados: any[]): { totalHorasPrevistas: string, totalHorasRealizadas: string } {
    let totalHorasPrevistas = 0;
    let totalHorasRealizadas = 0;

    // Função para converter horas e minutos para o formato HH:MM
    const converterParaHoraMinuto = (totalHoras: number): string => {
      const horas = Math.floor(totalHoras);  // Parte inteira para as horas
      const minutos = Math.round((totalHoras - horas) * 60);  // Resto em minutos
      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    };

    // Itera sobre o array principal
    dados.forEach(item => {
      let itemTotalHorasPrevistas = 0;
      let itemTotalHorasRealizadas = 0;

      item.dailyReport.forEach((report: any) => {
        // Função para converter string de horas (HH:MM) para número de horas em decimal
        const converterParaDecimal = (horas: string): number => {
          if (horas && horas.includes(':')) {
            const [hora, minutos] = horas.split(':').map(Number);
            // Convertendo minutos corretamente para horas decimais
            return hora + minutos / 60;
          }
          return 0;  // Retorna 0 caso o formato de hora não seja válido
        };

        // Converte e soma as horas previstas, mas apenas se o valor não for nulo ou vazio
        if (report.horasPrevistas && report.horasPrevistas !== '') {
          itemTotalHorasPrevistas += converterParaDecimal(report.horasPrevistas);
        }

        // Converte e soma as Horas executadas, mas apenas se o valor não for nulo ou vazio
        if (report.horasRealizadas && report.horasRealizadas !== '') {
          itemTotalHorasRealizadas += converterParaDecimal(report.horasRealizadas);
        }
      });

      // Atualiza os totais gerais
      totalHorasPrevistas += itemTotalHorasPrevistas;
      totalHorasRealizadas += itemTotalHorasRealizadas;

      // Converte a soma para o formato HH:MM
      item.horasPrevistasTotal = converterParaHoraMinuto(itemTotalHorasPrevistas);
      item.horasRealizadasTotal = converterParaHoraMinuto(itemTotalHorasRealizadas);

      // Determina a informação do item
      item.info = itemTotalHorasRealizadas >= itemTotalHorasPrevistas ? 'positive' : 'negative';
    });

    // Retorna os totais com o formato HH:MM
    return {
      totalHorasPrevistas: converterParaHoraMinuto(totalHorasPrevistas),
      totalHorasRealizadas: converterParaHoraMinuto(totalHorasRealizadas)
    };
  }

  private beforeRedirect() {
    this.router.navigate(['/']);

  }

  redirectToDailyReportDetail(selectedItem: any) {

    this.dailyReportService.item = selectedItem;
    this.router.navigate(['detail', selectedItem['id']]);
  }

  redirectToDailyReportEdit() {
    this.dailyReportService.item = this.selectDailyReport;
    this.router.navigate(['edit', this.selectDailyReport['id']]);
  }

  onShowMore() {}

  getColumns() {

    const airfareDetail: PoTableDetail = {
      columns: [
        { property: 'placa', label: 'Placa' },
        { property: 'dataInicioDisplay', label: 'Data' },
        { property: 'horasPrevistas', label: 'Horas previstas' },
        { property: 'horasRealizadas', label: 'Horas executadas' },
        { property: 'justificativa' },
        { property: 'responsavel', label: 'Responsável' },
      ],
      typeHeader: 'top'
    };

    return [
      {property: 'displayNameCliente', label: 'Cliente'},
      {property: 'horasPrevistasTotal', label: 'Total de horas previstas'},
      {property: 'horasRealizadasTotal', label: 'Total de Horas executadas'},
      {
        property: 'info',
        label: 'Status',
        type: 'subtitle',
        width: '180px',
        subtitles: [
          { value: 'positive', color: 'color-10', label: 'No prazo', content: 'NP' },
          { value: 'negative', color: 'color-07', label: 'Atrasado', content: 'A'},
        ]
      },
      {property: 'dailyReport', label: 'Detalhes', type: 'detail', detail: airfareDetail }
    ]
  }

}
