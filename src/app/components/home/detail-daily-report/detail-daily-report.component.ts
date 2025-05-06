import { PoBreadcrumb, PoDynamicViewField, PoModalComponent, PoPageAction, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { DailyReportService } from './../daily-report.service';
import { Component, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-detail-daily-report',
  templateUrl: './detail-daily-report.component.html',
  styleUrl: './detail-daily-report.component.scss',
  standalone: false,
})
export class DetailDailyReportComponent implements OnInit {
  items: Array<any> = [];
  itemsDias: Array<any> = [];
  showSecondCombo = false;
  selectedPlaca = '';
  private apiKey = 'AIzaSyD1iWjBHl4D5-1zqGNDtJoRlg5WQiFVPf0';
  private geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

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
  columns: Array<PoTableColumn> = this.getColumns();
  fields: Array<PoDynamicViewField> = [
    {property: 'displayNameCliente', label: 'Cliente' },
    {property: 'horasPrevistasTotal', label: 'Horas previstas total'},
    {property: 'horasRealizadasTotal', label: 'Horas executadas total'}
  ];
  imageSrc: string = ''; // Input image source
  isFullScreen: boolean = false;
  @ViewChild(PoModalComponent, { static: false })
  poModal!: PoModalComponent;

  public actions: Array<PoPageAction> = [
    {
      label: 'Justificar',
      action: this.redirectToDailyReportEdit.bind(this)
    },
    {
      label: 'Exportar',
      icon: 'an an-file-pdf',
      action: this.handlePdf.bind(this)
    }
  ];

  constructor(
    public dailyReportService: DailyReportService,
    private http: HttpClient,
    private pdfService: PdfService,
    public fb: FormBuilder,
    private router: Router) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      placa: ['', []], // Initialize with a default value
      dia: ['', []], // Initialize with a default value
    });

    console.log(this.dailyReportService.item.dailyReport)
    this.items = [...this.agruparPorPlaca(this.dailyReportService.item.dailyReport)]

  }

  onHandleGoBack() {
    this.router.navigate([`home`]);
  }

  handlePdf() {
    this.pdfService.generateDailyReport({
      client: "Cliente XYZ",
      location: "Rua das Obras, 123",
      contractNumber: "2023/456",
      date: "15/10/2023",
      servicesDescription: "Limpeza do canteiro de obras\nInspeção de equipamentos",
      weatherConditions: "Céu limpo, sem chuva",
      clientObservations: "Nenhuma observação",
      teamInvolved: "João Silva (Coord.)\nMaria Oliveira",
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "13:00", end: "17:00" }
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
    console.log('Fotos com geolocalização:', this.arrFotos);
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
      typeHeader: 'inline'
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
