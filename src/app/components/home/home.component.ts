import { SiengeApiService } from './../../services/sienge-api.service';
import { DailyReportService } from './daily-report.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoPageFilter, PoTableAction, PoTableColumn, PoTableComponent, PoTableDetail } from '@po-ui/ng-components';
import { CrudService } from '../../services/crud.service';
import { ExcelService } from '../../services/excel.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { isEmpty } from 'rxjs';
import { UserService } from '../../services/user.service';

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
  @ViewChild("poTableInstance") poTableInstance!: PoTableComponent;
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
    action: this.simpleSearch.bind(this),
    advancedAction: this.showAdvanceAction.bind(this),
    placeholder: 'Busque por clientes ou placas',
    width: 4
  };

  simpleSearch(filter: string) {
    if (filter.trim() === '') {
      this.tableItems = [];
      this.tableItems = this.defaultTableItems;
    }
    this.filterSearch(this.defaultTableItems, filter);
    this.disclamer.concat()

  }

  disclamer: Array<any> = [];

  close: PoModalAction = {
    action: () => {
      this.advancedFilterModal.close();
    },
    label: 'Fechar',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      let filteredItems = [...this.defaultTableItems];

      // Filtro por intervalo de datas
      if (this.form.get('datePickerRanger')?.value?.start && this.form.get('datePickerRanger')?.value?.end) {
        filteredItems = this.filterByDateRange(filteredItems, this.form.get('datePickerRanger')?.value.start, this.form.get('datePickerRanger')?.value.end);
      }

      // Filtro por cliente
      if (this.form.get('cliente')?.value?.trim()) {
        filteredItems = this.filterByClient(filteredItems, this.form.get('cliente')?.value);
      }

      // Filtro por placa
      if (this.form.get('placa')?.value?.trim()) {
        filteredItems = this.filterByPlate(filteredItems, this.form.get('placa')?.value);
      }

      this.tableItems = [...filteredItems];

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
    // Converte strings 'YYYY-MM-DD' para Date, ajustando para o timezone local
    const startDate = new Date(startDateStr + 'T00:00:00');
    let endDate = new Date(endDateStr + 'T00:00:00');

    // Valida as datas de filtro
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Datas de filtro inválidas');
      return [];
    }

    // Ajusta o final do dia para incluir todo o dia final (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    return data.map(item => {
      if (!item?.dailyReport) return item;

      // Filtra os dailyReports que estão no intervalo de datas
      const filteredDailyReports = item.dailyReport.filter((report: any) => {
        const reportDate = report?.dataInicioDisplay
          ? this.convertDMYToDate(report.dataInicioDisplay)
          : null;

        if (!reportDate) return false;

        // Verifica se a data está entre startDate (início do dia) e endOfDay (final do dia)
        return reportDate >= startDate && reportDate <= endOfDay;
      });

      // Retorna o item com apenas os dailyReports filtrados
      return {
        ...item,
        dailyReport: filteredDailyReports
      };
    }).filter(item => item.dailyReport.length > 0); // Remove itens sem dailyReports no intervalo
  }

  // Função auxiliar para converter DD/MM/YYYY para Date
  convertDMYToDate(dateStr: string): Date | null {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é 0-based
    const year = parseInt(parts[2], 10);

    // Verifica se os valores são válidos
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    // Retorna a data no início do dia (00:00:00)
    return new Date(year, month, day);
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

    if (filters !== '') {
      let filteredByPlateItems: any[] = this.filterByPlate(data, filters);
      let filterdByClientItems: any[] = this.filterByClient(data, filters);

      this.tableItems = [...filteredByPlateItems];
      this.tableItems = this.tableItems.concat([...filterdByClientItems]);
    }

  }


  filterByPlate(data: any[], plate: string): any[] {
    return data.filter(item => {
      // Se o item for inválido, ignora
      if (!item) return false;

      // Se o item tem 'dailyReport' (array ou objeto)
      if (item.dailyReport) {
        if (Array.isArray(item.dailyReport)) {
          // Verifica se algum report dentro de dailyReport tem a placa
          return item.dailyReport.some((report: any) => (report?.placa as string).toUpperCase().includes(plate.toUpperCase()));
        }
        // Se dailyReport for um objeto único (não array)
        else if (typeof item.dailyReport === 'object' && (item.dailyReport.placa as string).toUpperCase().includes(plate.toUpperCase())) {
          return true;
        }
      }

      // Se o item tem 'placa' diretamente
      if (item.placa !== undefined && item.placa.includes(plate)) {
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
      if (item.displayNameCliente !== undefined && (item.displayNameCliente as string).toUpperCase().includes(clientName.toUpperCase()) ) {
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
    private siengeApiService: SiengeApiService,
    private dailyReportService: DailyReportService,
    private userService: UserService) {}

  ngOnInit() {
    this.form = this.fb.group({
      datePickerRanger: [''],
      cliente: [''],
      placa: ['']
    });
    this.loadItems();
  }

  async loadItems() {
    try {
      // Busca todos os RDOs
      const allItems = await this.crudService.getItems('rdo') ?? [];

      // Recupera o usuário logado
      const user = this.userService.getUser();

      // Se o usuário for do tipo Cliente, filtra os RDOs do cliente dele
      if (user && user.type === 'Cliente' && user.cliente) {
        this.items = allItems.filter((item: any) => item.cliente === user.cliente);
      } else {
        // Se não for cliente, mostra todos
        this.items = allItems;
      }

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
    this.excelService.exportRelatorioToExcel(this.poTableInstance.filteredItems, 'rdo');
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
