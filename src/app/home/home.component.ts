import { DailyReportService } from './daily-report.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: false
})
export class HomeComponent {

  logo = '/assets/swl_logo.png';
  columns: Array<PoTableColumn> = this.getColumns();
  selectDailyReport: any;
  public actions: Array<PoPageAction> = [
    { label: 'Visualizar',
      disabled: this.disableEditButton.bind(this),
    action: this.redirectToDailyReportDetail.bind(this) },
  ];

  tableActions: Array<PoTableAction> = [
    {
      action: this.onShowMore.bind(this),
      icon: 'ph ph-file-pdf',
      label: ''
    }
  ];

  constructor(
    private router: Router,
    private dailyReportService: DailyReportService) {}

  disableEditButton() {
    return !this.selectDailyReport;
  }

  onSelectDailyReport(selected: any) {
    this.selectDailyReport = selected;
    this.actions[0].disabled = false;
  }

  onUnselectDailyReport() {
    this.selectDailyReport = undefined;
    this.actions[0].disabled = this.disableEditButton();
  }

  redirectToDailyReportDetail() {
    this.dailyReportService.item = this.selectDailyReport;
    this.router.navigate(['detail', this.selectDailyReport['id']]);
  }

  onShowMore() {}

  getColumns(): Array<PoTableColumn> {
    return [
      {property: 'total_de_horas', label: 'Total de horas'},
      {property: 'horasPrevistas', label: 'Horas previstas'},
      {
        property: 'status',
        type: 'subtitle',
        width: '180px',
        subtitles: [
          { value: 'positive', color: 'color-10', label: 'Meta alcançada', content: 'MA' },
          { value: 'negative', color: 'color-07', label: 'Abaixo do previsto', content: 'AP'},
        ]
      },
      {property: 'data'},
      {property: 'endereco'},
      {property: 'obra'},
      {property: 'placa'},
      {property: 'tipo_de_servico', label: 'Tipo de serviço' },
      {property: 'locomocao', label: 'Locomoção'},
      {property: 'manutencao', label: 'Manutenção'},
      {property: 'id', label: 'id'},

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

  tableItems = [
    {
      id: "6b2f99f4-46b8-4d39-8996-77fdefed6e2b",
      placa: "KLM-1234",
      obra: "Reforma de fachada",
      data: "12/06/2024",
      endereco: "Rua das Palmeiras, 45, Belo Horizonte, MG",
      tipo_de_servico: "2",
      colaboradores: ["Marcelo Costa", "Luciana Pires"],
      locomocao: "00:50",
      manutencao: "02:00",
      total_de_horas: "06:30",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "7b732469-8c2d-4628-a9c1-72d4e2e22ed0",
      placa: "MNO-2345",
      obra: "Pavimentação de rua",
      data: "22/07/2024",
      endereco: "Rua do Sol, 123, Campinas, SP",
      tipo_de_servico: "1",
      colaboradores: ["José Souza", "Ricardo Lima", "Paula Rodrigues"],
      locomocao: "00:30",
      manutencao: "01:50",
      total_de_horas: "07:40",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "ef278d0d-b2d1-4715-98a5-8fc9fc5c211f",
      placa: "PQR-3456",
      obra: "Construção de muro",
      data: "03/08/2024",
      endereco: "Rua São João, 78, Salvador, BA",
      tipo_de_servico: "1",
      colaboradores: ["André Lima", "Sílvia Rocha"],
      locomocao: "01:10",
      manutencao: "01:30",
      total_de_horas: "07:20",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "f9c45ad2-023a-4010-a324-8c0e9a6d258a",
      placa: "STU-4567",
      obra: "Instalação de ar condicionado",
      data: "18/09/2024",
      endereco: "Av. Rio Branco, 210, Fortaleza, CE",
      tipo_de_servico: "3",
      colaboradores: ["Carlos Martins", "Fernanda Almeida"],
      locomocao: "00:40",
      manutencao: "02:20",
      total_de_horas: "06:40",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "ad9f1a78-c458-45b2-89d1-604e2b87651e",
      placa: "VWX-5678",
      obra: "Reforma elétrica",
      data: "25/09/2024",
      endereco: "Rua Boa Vista, 34, Curitiba, PR",
      tipo_de_servico: "3",
      colaboradores: ["Gustavo Costa", "Renata Souza"],
      locomocao: "00:50",
      manutencao: "03:00",
      total_de_horas: "07:30",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "2a809d3f-4441-4629-906b-92e7f56d7be6",
      placa: "YZA-6789",
      obra: "Limpeza pós-obra",
      data: "10/10/2024",
      endereco: "Av. das Américas, 987, Rio de Janeiro, RJ",
      tipo_de_servico: "5",
      colaboradores: ["Vitor Almeida", "Luciana Santos"],
      locomocao: "01:00",
      manutencao: "02:00",
      total_de_horas: "07:00",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "97b78a5f-f25b-4d71-a9a7-c063f9c2355b",
      placa: "BCD-9012",
      obra: "Desentupimento de esgoto",
      data: "22/11/2024",
      endereco: "Rua dos Três Irmãos, 45, São Paulo, SP",
      tipo_de_servico: "5",
      colaboradores: ["Júlio Rocha", "Tânia Pires"],
      locomocao: "00:30",
      manutencao: "02:30",
      total_de_horas: "07:00",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "54214a4f-7f1f-4878-8e1a-b51e46e1a67b",
      placa: "EFG-3456",
      obra: "Reforma de cozinha",
      data: "30/11/2024",
      endereco: "Rua XV de Novembro, 301, Recife, PE",
      tipo_de_servico: "2",
      colaboradores: ["Marcos Souza", "Carla Mendes"],
      locomocao: "00:45",
      manutencao: "02:15",
      total_de_horas: "07:30",
      horasPrevistas: "08:00",
      status: "negative"
    },
    {
      id: "a20f24ae-5d53-4643-92b7-dad0e5e89926",
      placa: "GHI-2345",
      obra: "Instalação de sistema de segurança",
      data: "05/12/2024",
      endereco: "Av. Dom Pedro II, 150, Porto Alegre, RS",
      tipo_de_servico: "4",
      colaboradores: ["João Gomes", "Patrícia Costa"],
      locomocao: "01:00",
      manutencao: "02:00",
      total_de_horas: "08:00",
      horasPrevistas: "08:00",
      status: "positive"
    }
  ]
  ;
}
