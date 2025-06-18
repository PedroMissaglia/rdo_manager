import { poThemeDefaultActions } from '@po-ui/ng-components';
import { PoBreadcrumb, PoComboComponent, PoComboOption, PoDynamicViewField, PoModalAction, PoModalComponent, PoPageAction, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { DailyReportService } from './../daily-report.service';
import { Component, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DailyReportPdfService } from '../../../services/pdf.service';
import { SiengeApiService } from '../../../services/sienge-api.service';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-detail-daily-report',
  templateUrl: './detail-daily-report.component.html',
  styleUrl: './detail-daily-report.component.scss',
  standalone: false,
})
export class DetailDailyReportComponent implements OnInit {
  items: Array<any> = [];
  itemsDias: Array<any> = [];
  api = "AIzaSyD1iWjBHl4D5-1zqGNDtJoRlg5WQiFVPf0";
  showSecondCombo = false;
  selectedPlaca = '';
  poComboExportPdfPerDate: PoComboOption[] = [];
  private apiKey = 'AIzaSyD1iWjBHl4D5-1zqGNDtJoRlg5WQiFVPf0';
  private geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  rdos: any;
  imageUrl: string = '';
  visible: boolean = false;
  close = new EventEmitter<void>();

  columnsImage: PoTableColumn[] = [
    {
      property: 'foto',
      label: 'Foto',
      type: 'columnTemplate',
      width: '200px'
    },
    {
      property: 'info',
      label: 'Informações',
      type: 'columnTemplate'
    }
  ];

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.closeViewer();
  }

  closeViewer() {
    this.close.emit();
    this.closeImageViewer();
  }


  arrFotos: Array<any> = [];
  form!: FormGroup;
  formModalPDF!: FormGroup;
  columns: Array<PoTableColumn> = this.getColumns();
  fields: Array<PoDynamicViewField> = [
    {property: 'displayNameCliente', label: 'Cliente' },
    {property: 'horasPrevistasTotal', label: 'Horas previstas total'},
    {property: 'horasRealizadasTotal', label: 'Horas executadas total'}
  ];
  imageSrc: string = ''; // Input image source
  isFullScreen: boolean = false;
  @ViewChild(PoModalComponent, { static: false }) poModal!: PoModalComponent;
  @ViewChild('poComboPDF', { static: false }) poComboPDF!: PoComboComponent;
  @ViewChild('modal', { static: false }) poModalExportPDF!: PoModalComponent;

  siengeResponse = null;

  public actions: Array<PoPageAction> = [
    {
      label: 'Justificar',
      action: this.redirectToDailyReportEdit.bind(this)
    },
    {
      label: 'Exportar',
      icon: 'an an-file-pdf',
      action: this.poModalPDFOpen.bind(this)
    }
  ];

  primaryAction: PoModalAction = {
    action: () => {
      this.handlePdf(this.formModalPDF.value["dia"]);
      // this.pdfService.generateDailyReport(reportData);
    },
    label: 'Exportar',
    // disabled: !!this.formModalPDF.value["dia"]
  };

  constructor(
    public dailyReportService: DailyReportService,
    private http: HttpClient,
    private pdfService: DailyReportPdfService,
    public fb: FormBuilder,
    private siengeApiService: SiengeApiService,
    private crudService: CrudService,
    private router: Router) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      placa: ['', []], // Initialize with a default value
      dia: ['', []], // Initialize with a default value
    });

    this.formModalPDF = this.fb.group({
      dia: ['', []], // Initialize with a default value
    });

    this.items = [...this.agruparPorPlaca(this.dailyReportService.item.dailyReport)];
    this.siengeApiService.getConstructions().subscribe(
      response => this.siengeResponse = response
    );

  }

  filtrarDailyReportsPorData(relatorio: any, dataFiltro: string) {
  // Filtra os reports pela data
  const filteredDailyReports = relatorio.dailyReport.filter((report: any) => {
    return report.dataInicioDisplay === dataFiltro;
  });

  relatorio.dailyReport = filteredDailyReports;
  return relatorio;

}

  async poModalPDFOpen(row: any) {

    this.poComboExportPdfPerDate = this.transformarParaPoCombo(row["detalhes"]);
    this.poModalExportPDF.open();
  }
  onHandleGoBack() {
    this.router.navigate([`home`]);
  }

  consolidarFotos(dailyReports: any[]): any[] {
  if (!dailyReports || !Array.isArray(dailyReports)) {
    return [];
  }

  // Extrai todas as fotos de todos os reports
  const todasFotos = dailyReports.reduce((acc, report) => {
    if (report.foto && Array.isArray(report.foto)) {
      return [...acc, ...report.foto];
    }
    return acc;
  }, []);

  // Ordena as fotos por horário (dataFoto)
  return todasFotos.sort((a: any, b: any) => {
    const timeA = this.converterHoraParaMinutos(a.dataFoto);
    const timeB = this.converterHoraParaMinutos(b.dataFoto);
    return timeA - timeB;
  });
}

/**
 * Converte hora no formato HH:MM para minutos totais
 * @param hora String no formato HH:MM
 * @returns Número total de minutos
 */
private converterHoraParaMinutos(hora: string): number {
  if (!hora || !hora.includes(':')) return 0;

  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

  async handlePdf(row: any) {
    this.rdos = await this.crudService.getItems('rdo') ?? [];
    const dailyReportsFiltrados = this.filtrarDailyReportsPorData(this.rdos[0], this.formModalPDF.get('dia')!.value)
    const fotosConsolidadas = this.consolidarFotos(dailyReportsFiltrados["dailyReport"]);

    const reportData = {
      companyName: 'SWL',
      companyTagline: 'Tecnologia em Saneamento e Limpeza',
      companyFullName: 'SWL TECNOLOGIA EM LIMPEZA, SANEAMENTO E CONSTRUÇÃO LTDA',
      cnpj: '24.337.551/0001-03',
      companyAddress: 'ROD BR 101, Nº 8025 - BOX 02',
      cep: '88.312-501',
      city: 'SÃO VICENTE - ITAJAL',
      state: 'SC',
      client: dailyReportsFiltrados.displayNameCliente,
      date: this.formModalPDF.get('dia')!.value,
      servicesDescription: 'Description of services performed today...',
      weatherConditions: 'Sunny with occasional clouds',
      clientObservations: 'No observations from client',
      teamInvolved: 'John Doe, Jane Smith, Carlos Silva',
      morning: { start: '08:00', end: '12:00' },
      afternoon: { start: '13:00', end: '17:00' },
      night: { start: '', end: '' },
      foto: fotosConsolidadas,
      dailyReport: dailyReportsFiltrados["dailyReport"]
    };
    this.pdfService.generateDailyReport(reportData)

  }

  transformarParaPoCombo(dadosOriginais: any[]): PoComboOption[] {
  return dadosOriginais.map(item => {
    // Cria a label base combinando data e horas realizadas
    let label = `${item.dataInicioDisplay}`;


    return {
      label: label,
      value: label, // Pode ser o objeto completo ou um identificador único
      // Mantém os dados originais para referência se necessário
      originalData: item
    };
  });
}

  redirectToDailyReportEdit(selectedRow: any) {
    const obj = this.dailyReportService.item;
    const filteredObj = this.filtrarDailyReportPorPlaca(obj, selectedRow['placa']);
    this.dailyReportService.itemFilteredByPlate = filteredObj;
    this.router.navigate(['edit', filteredObj['id']]);
  }

  filtrarDailyReportPorPlaca(obj: any, placa: string): any {
    const dailyReportFiltrado = obj.dailyReport.filter((registro: any) => registro.placa === placa);

    return {
      ...obj,
      dailyReport: dailyReportFiltrado,
    };
  }


  obterDataInicioDisplayPorPlaca(placa: string, registros: any[]): string[] {
    // Filtra o array de registros para encontrar o registro com a placa correspondente
    const registroEncontrado = registros.find(registro => registro.placa === placa);

    // Se o registro foi encontrado, retorna o array de 'dataInicioDisplay' dos detalhes
    if (registroEncontrado) {
      return registroEncontrado.detalhes.map((detalhe: any) => ({
        dataInicioDisplay: detalhe.dataInicioDisplay,
        id: detalhe.dataInicioDisplay, // 'id' é do registro principal
        value: detalhe.dataInicioDisplay // 'value' também é do registro principal
      }));
    }

    // Se não encontrar o registro com a placa fornecida, retorna um array vazio
    return [];
  }

  onHandleGoEdit() {}

  openFullscreen(imageUrl: string): void {
    this.imageSrc = imageUrl;
    this.poModal.open();
  }

  // Method to close full-screen view
  closeFullscreen(): void {
    this.isFullScreen = false;
  }

  async onHandleDia(dia: any) {
    let arr = this.obterFotosPorPlacaEDataInicioDisplay(this.selectedPlaca, dia, this.dailyReportService.item.dailyReport);

    // Cria um array de promessas
    const promises = arr.map(photo => {
      return new Promise<void>((resolve) => {
        this.getAddressFromCoordinates(photo.latitude, photo.longitude)
          .subscribe({
            next: (obj) => {
              photo.geo = obj?.results[0]?.formatted_address || 'Endereço não encontrado';
              resolve();
            },
            error: () => {
              photo.geo = 'Erro ao obter endereço';
              resolve();
            }
          });
      });
    });

    // Aguarda todas as promessas serem resolvidas
    await Promise.all(promises);

    this.arrFotos = [...arr];
  }

  obterFotosPorPlacaEDataInicioDisplay(placa: string, dataInicioDisplay: string, registros: any[]): any[] {
    // Filtra o array de registros para encontrar o registro com a placa e dataInicioDisplay correspondentes
    const registroEncontrado = registros.find(
      (registro) => registro.placa === placa && registro.dataInicioDisplay === dataInicioDisplay
    );

    // Se o registro for encontrado, retorna o array de fotos
    if (registroEncontrado) {
      return registroEncontrado.foto;
    }

    // Se não encontrar o registro com a placa e dataInicioDisplay fornecidos, retorna um array vazio
    return [];
  }

  getAddressFromCoordinates(latitude: number, longitude: number): Observable<any> {
    const url = `${this.geocodeUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  agruparPorPlaca(arr: any[]) {
    // Função para converter horas em formato hh:mm para minutos
    const converterParaMinutos = (horas: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }) => {
      const [hora, minutos] = horas.split(":").map(Number);
      return hora * 60 + minutos;
    };

    // Função para converter minutos de volta para o formato hh:mm
    const converterParaHoras = (minutosTotais: number) => {
      const horas = Math.floor(minutosTotais / 60);
      const minutos = minutosTotais % 60;
      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
    };

    // Inicializando um objeto para armazenar os grupos
    const agrupado: any = {};

    // Iterando sobre o array de objetos
    arr.forEach((item: { placa: any; horasPrevistas: any; horasRealizadas: any; dataInicioDisplay: any; justificativa: any; responsavel: any; aprovacaoFiscal: any; aprovacaoCliente: any; }) => {
      // Obter a placa
      const placa = item.placa;

      // Inicializa o grupo se ainda não existir
      if (!agrupado[placa]) {
        agrupado[placa] = {
          placa: placa,
          horasPrevistasTotal: 0,
          horasRealizadasTotal: 0,
          detalhes: []  // Array para armazenar os detalhes de cada item
        };
      }

      // Soma as horas previstas e realizadas no grupo em minutos
      agrupado[placa].horasPrevistasTotal += converterParaMinutos(item.horasPrevistas || "00:00");
      agrupado[placa].horasRealizadasTotal += converterParaMinutos(item.horasRealizadas || "00:00");

      // Adiciona o item de detalhes com as informações solicitadas
      agrupado[placa].detalhes.push({
        dataInicioDisplay: item.dataInicioDisplay,
        horasPrevistas: item.horasPrevistas,
        horasRealizadas: item.horasRealizadas,
        aprovacaoCliente: item.aprovacaoCliente === true ? 'Sim' : 'Não',
        aprovacaoFiscal: item.aprovacaoFiscal  === true ? 'Sim' : 'Não',
        justificativa: item.justificativa || "",
        responsavel: item.responsavel || ""
      });
    });

    // Transformar o objeto de grupos em um array, convertendo as somas de minutos para hh:mm
    return Object.values(agrupado).map((item: any) => {
      const horasPrevistasTotal = converterParaHoras(item.horasPrevistasTotal);
      const horasRealizadasTotal = converterParaHoras(item.horasRealizadasTotal);

      return {
        placa: item.placa,
        horasPrevistasTotal: horasPrevistasTotal,
        id: item.placa,
        value: item.placa,
        horasRealizadasTotal: horasRealizadasTotal,
        status: item.horasRealizadasTotal >= item.horasPrevistasTotal ? "positive" : "negative",
        detalhes: item.detalhes  // Adiciona o array de detalhes
      };
    });
  }

  onHandlePlaca(placa: any) {

    this.form.get('dia')?.setValue('');
    this.arrFotos = [];

    this.showSecondCombo = true;
    this.selectedPlaca = placa;

    this.itemsDias = this.obterDataInicioDisplayPorPlaca(this.selectedPlaca, this.items);
  }

  getColumns() {

    const airfareDetail: PoTableDetail = {
      columns: [
        { property: 'dataInicioDisplay', label: 'Data' },
        { property: 'horasPrevistas', label: 'Horas previstas' },
        { property: 'horasRealizadas', label: 'Horas executadas' },
        { property: 'aprovacaoCliente', label: 'Aprovação cliente' },
        { property: 'aprovacaoFiscal', label: 'Aprovação fiscal' },
        { property: 'justificativa' },
        { property: 'responsavel', label: 'Responsável' },
      ],
      typeHeader: 'top',
      hideSelect: false
    };

    return [
      { property: 'placa', label: 'Placa' },
      { property: 'horasPrevistasTotal', label: 'Horas previstas total' },
      { property: 'horasRealizadasTotal', label: 'Horas executadas total' },
      {
        property: 'status',
        label: 'Status',
        type: 'subtitle',
        width: '180px',
        subtitles: [
          { value: 'positive', color: 'color-10', label: 'No prazo', content: 'NP' },
          { value: 'negative', color: 'color-07', label: 'Atrasado', content: 'A'},
        ]
      },
      {property: 'detalhes', label: 'Detalhes', type: 'detail', detail: airfareDetail }
    ]
  }

  isImageViewerVisible = false;
  currentImageUrl = '';

  openImageViewer(imageUrl: string) {
    this.currentImageUrl = imageUrl;
    this.isImageViewerVisible = true;
    document.body.style.overflow = 'hidden'; // Desabilita scroll da página
  }

  closeImageViewer() {
    this.isImageViewerVisible = false;
    document.body.style.overflow = ''; // Reabilita scroll da página
  }

}
