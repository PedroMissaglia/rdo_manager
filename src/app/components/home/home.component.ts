import { DailyReportService } from './daily-report.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoPageFilter, PoTableAction, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { CrudService } from '../../services/crud.service';
import { ExcelService } from '../../services/excel.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: false
})
export class HomeComponent implements OnInit{

  @ViewChild('advancedFilterModal', { static: true }) advancedFilterModal!: PoModalComponent;
  logo = '/assets/swl_logo.png';
  columns: Array<PoTableColumn> = this.getColumns();
  selectDailyReport: any;
  defaultTableItems: Array<any> = [];
  public actions: Array<PoPageAction> = [
    {
      label: 'Excel',
      icon: 'an an-microsoft-excel-logo',
      type: 'default',
      action: this.handleExportToExcel.bind(this)
    }
  ];
  items: any;
  public readonly filter: PoPageFilter = {
    action: this.showAction.bind(this),
    advancedAction: this.showAdvanceAction.bind(this)
  };

  async showAction(filter: string) {
    this.filterSearch(this.defaultTableItems, filter);

  }

  close: PoModalAction = {
    action: () => {
      this.advancedFilterModal.close();
    },
    label: 'Fechar',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {

      let a = this.filterByDateRange(this.defaultTableItems, this.form.get('datePickerRanger')?.value.start, this.form.get('datePickerRanger')?.value.end);

      this.tableItems = [...a];

      this.advancedFilterModal.close();
    },
    label: 'Buscar'
  };


  showAdvanceAction(filter: string) {
    this.advancedFilterModal.open();
  }

  filterByDateRange(
    data: any[],
    startDateStr: string, // Formato 'YYYY-MM-DD'
    endDateStr: string    // Formato 'YYYY-MM-DD'
  ): any[] {
    // Converte strings 'YYYY-MM-DD' para Date
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Valida as datas de filtro
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Datas de filtro inválidas');
      return [];
    }

    return data.filter(item => {
      if (!item?.dailyReport) return false;

      return item.dailyReport.some((report: any) => {
        // Converte dataInicioDisplay (DD/MM/YYYY) para Date
        const reportDate = report?.dataInicioDisplay
          ? this.convertDMYToDate(report.dataInicioDisplay)
          : null;

        // Se a data do relatório for válida, verifica o intervalo
        return reportDate && reportDate >= startDate && reportDate <= endDate;
      });
    });
  }


  private convertDMYToDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split('/').map(Number);
    // Validação extra
    if (day > 31 || month > 12 || year < 1000) return null;

    return new Date(year, month - 1, day);
  }

  getObjectsByPlate(data: any[], plate: string): any[] {
    return data.filter(item => {
      // Check if the item has dailyReport array
      if (item.dailyReport && Array.isArray(item.dailyReport)) {
        // Check if any report in dailyReport matches the plate
        return item.dailyReport.some((report: any) => report.placa === plate);
      }
      return false;
    });
  }

  filterSearch(data: any[], filters: any) {
    let filteredByPlateItems: any[] = this.filterByPlate(data, filters);

    let filterdByClientItems: any[] = this.filterByClient(data, filters);

    this.tableItems = [...filteredByPlateItems];
    this.tableItems = this.tableItems.concat([...filterdByClientItems]);

  }


  filterByPlate(data: any[], plate: string): any[] {
    return data.filter(item => {
      // Se o item for inválido, ignora
      if (!item) return false;

      // Se o item tem 'dailyReport' (array ou objeto)
      if (item.dailyReport) {
        if (Array.isArray(item.dailyReport)) {
          // Verifica se algum report dentro de dailyReport tem a placa
          return item.dailyReport.some((report: any) => report?.placa === plate);
        }
        // Se dailyReport for um objeto único (não array)
        else if (typeof item.dailyReport === 'object' && item.dailyReport.placa === plate) {
          return true;
        }
      }

      // Se o item tem 'placa' diretamente
      if (item.placa !== undefined && item.placa === plate) {
        return true;
      }

      // Se não encontrou a placa em nenhum lugar, descarta o item
      return false;
    });
  }

  filterByClient(data: any[], clientName: string): any[] {
    return data.filter(item => {
      // Se o item for inválido, ignora
      if (!item) return false;

      // Se o item tem 'placa' diretamente
      if (item.displayNameCliente !== undefined && item.displayNameCliente === clientName) {
        return true;
      }

      // Se não encontrou a placa em nenhum lugar, descarta o item
      return false;
    });
  }
  // Example usage:


  tableActions: Array<PoTableAction> = [
    {
      action: this.onShowMore.bind(this),
      icon: 'an an-file-pdf',
      label: ''
    }
  ];

  actionsTable: Array<PoTableAction> = [
    {
      action: this.redirectToDailyReportDetail.bind(this),
      label: 'Visualizar'
    }
  ];


  form!: FormGroup;

  tableItems: Array<any> = [];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', action: this.beforeRedirect.bind(this)}]
  };

  constructor(
    private router: Router,
    private excelService: ExcelService,
    private crudService: CrudService,
    private fb: FormBuilder,
    private poNotification :PoNotificationService,
    private dailyReportService: DailyReportService) {}

  ngOnInit() {
    this.form = this.fb.group({
      datePickerRanger: ['', [Validators.required]]
    });
    this.loadItems();
  }

  async loadItems() {
    try {
      this.items = await this.crudService.getItems('rdo') ?? [];

      this.calcularTotais(this.items);

      this.tableItems = [...this.items];
      this.defaultTableItems = [...this.items];

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

  handleExportToExcel() {
    this.excelService.exportRelatorioToExcel(this.tableItems, 'rdo');
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
        { property: 'totalImprodutiva', label: 'Horas improdutivas' },
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
