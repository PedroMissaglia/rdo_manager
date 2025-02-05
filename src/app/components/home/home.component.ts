import { DailyReportService } from './daily-report.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
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
      disabled: this.disableEditButton.bind(this),
      action: this.redirectToDailyReportDetail.bind(this)
    },
    {
      label: 'Justificar',
      disabled: this.disableEditButton.bind(this),
      action: this.redirectToDailyReportEdit.bind(this)
    },
  ];
  items: any;

  tableActions: Array<PoTableAction> = [
    {
      action: this.onShowMore.bind(this),
      icon: 'an an-file-pdf',
      label: ''
    }
  ];

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
      this.items = await this.crudService.getItems('rdo');
      this.tableItems = this.items;
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  disableEditButton() {
    return !this.selectDailyReport;
  }

  onSelectDailyReport(selected: any) {
    this.selectDailyReport = selected;
    this.actions[0].disabled = false;
  }

  private beforeRedirect() {
    this.router.navigate(['/']);

  }

  onUnselectDailyReport() {
    this.selectDailyReport = undefined;
    this.actions[0].disabled = this.disableEditButton();
  }

  redirectToDailyReportDetail() {
    this.dailyReportService.item = this.selectDailyReport;
    this.router.navigate(['detail', this.selectDailyReport['id']]);
  }

  redirectToDailyReportEdit() {
    this.dailyReportService.item = this.selectDailyReport;
    this.router.navigate(['edit', this.selectDailyReport['id']]);
  }

  onShowMore() {}

  getColumns(): Array<PoTableColumn> {
    return [
      {property: 'cliente', label: 'Cliente'},
      {property: 'placa', label: 'Placa'},
      {property: 'dataInicioDisplay', label: 'Data'},
      {property: 'horasPrevistas', label: 'Horas previstas'},
      {property: 'horasRealizadas', label: 'Horas realizadas'},
      {
        property: 'info',
        label: 'Status',
        type: 'subtitle',
        width: '180px',
        subtitles: [
          { value: 'positive', color: 'color-10', label: 'Meta alcançada', content: 'MA' },
          { value: 'negative', color: 'color-07', label: 'Não justificado', content: 'NJ'},
          { value: 'justified', color: 'color-02', label: 'Justificado', content: 'JU'},
          { value: 'started', color: 'color-08', label: 'Em andamento', content: 'EA'},
        ]
      },
      {property: 'justificativa', label: 'Justificativa'},
      {property: 'prazo', label: 'Prazo'},
      {property: 'responsavel', label: 'Responsável'},
    ]
  }

  menus = [
    {
      label: 'Home',
      icon: 'ph ph-file-text',
      link: '/home',
      shortLabel: 'Home'
    },
    {
      label: 'Cadastros',
      icon: 'ph ph-folder-plus',
      shortLabel: 'Cadastros',
      subItems: [
        { label: 'Serviço', link: '/jobs' },
        { label: 'Colaborador', link: '/collaborators' }
      ]
    }
  ];

  tableItems = [];
}
