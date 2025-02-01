import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoPageAction, PoPageFilter, PoPageListComponent } from '@po-ui/ng-components';

@Component({
    selector: 'app-colaborador',
    templateUrl: './colaborador.component.html',
    styleUrl: './colaborador.component.scss',
    standalone: false
})
export class ColaboradorComponent implements OnInit{

  logo = '/assets/swl_logo.png';
  private disclaimers: any = [];
  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Cadastros' }, { label: 'Cobaborador' }]
  };
  public actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onNewCollaborator.bind(this) },
    { label: 'Editar', disabled: this.disableEditButton.bind(this),  },
    { label: 'Excluir', disabled: this.disableEditButton.bind(this) }
  ];
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
      id: 1,
      nome: "João Silva",
      cpf: "123.456.789-01",
      email: "joao.silva@email.com",
      telefone: "(11) 91234-5678",
      endereco: "Rua das Flores, 123, São Paulo, SP",
      cargo: "Engenheiro Civil",
      area_atuacao: "Civil",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-12345",
      experiencia_profissional: "10 anos de experiência em construção civil."
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      cpf: "234.567.890-12",
      email: "maria.oliveira@email.com",
      telefone: "(21) 91345-6789",
      endereco: "Avenida Brasil, 456, Rio de Janeiro, RJ",
      cargo: "Mestre de Obras",
      area_atuacao: "Civil",
      nivel_acesso: "Supervisor",
      registro_profissional: "CREA-67890",
      experiencia_profissional: "8 anos de experiência com supervisão de obras de grande porte."
    },
    {
      id: 3,
      nome: "Carlos Pereira",
      cpf: "345.678.901-23",
      email: "carlos.pereira@email.com",
      telefone: "(31) 91456-7890",
      endereco: "Rua dos Três Irmãos, 789, Belo Horizonte, MG",
      cargo: "Pedreiro",
      area_atuacao: "Civil",
      nivel_acesso: "Operário",
      registro_profissional: "CREA-23456",
      experiencia_profissional: "5 anos de experiência em alvenaria e acabamentos."
    },
    {
      id: 4,
      nome: "Ana Souza",
      cpf: "456.789.012-34",
      email: "ana.souza@email.com",
      telefone: "(41) 91567-8901",
      endereco: "Rua Paraná, 101, Curitiba, PR",
      cargo: "Engenheira Elétrica",
      area_atuacao: "Elétrica",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-34567",
      experiencia_profissional: "12 anos de experiência em projetos elétricos e manutenção."
    },
    {
      id: 5,
      nome: "Lucas Costa",
      cpf: "567.890.123-45",
      email: "lucas.costa@email.com",
      telefone: "(51) 91678-9012",
      endereco: "Avenida das Indústrias, 505, Porto Alegre, RS",
      cargo: "Mestre de Obras",
      area_atuacao: "Civil",
      nivel_acesso: "Supervisor",
      registro_profissional: "CREA-45678",
      experiencia_profissional: "15 anos de experiência com gestão de obras e equipes."
    },
    {
      id: 6,
      nome: "Juliana Lima",
      cpf: "678.901.234-56",
      email: "juliana.lima@email.com",
      telefone: "(61) 91789-0123",
      endereco: "Rua do Sol, 333, Brasília, DF",
      cargo: "Pedreiro",
      area_atuacao: "Civil",
      nivel_acesso: "Operário",
      registro_profissional: "CREA-56789",
      experiencia_profissional: "6 anos de experiência em construção civil e acabamento."
    },
    {
      id: 7,
      nome: "Marcos Gomes",
      cpf: "789.012.345-67",
      email: "marcos.gomes@email.com",
      telefone: "(71) 91890-1234",
      endereco: "Rua das Acácias, 222, Salvador, BA",
      cargo: "Engenheiro Mecânico",
      area_atuacao: "Mecânica",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-67890",
      experiencia_profissional: "7 anos de experiência em instalação e manutenção de sistemas mecânicos."
    },
    {
      id: 8,
      nome: "Fernanda Rocha",
      cpf: "890.123.456-78",
      email: "fernanda.rocha@email.com",
      telefone: "(85) 91901-2345",
      endereco: "Avenida Beira Mar, 501, Fortaleza, CE",
      cargo: "Engenheira Civil",
      area_atuacao: "Civil",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-78901",
      experiencia_profissional: "10 anos de experiência em gestão de projetos e obras civis."
    },
    {
      id: 9,
      nome: "Roberta Silva",
      cpf: "901.234.567-89",
      email: "roberta.silva@email.com",
      telefone: "(91) 92012-3456",
      endereco: "Rua da Paz, 444, Belém, PA",
      cargo: "Pedreiro",
      area_atuacao: "Civil",
      nivel_acesso: "Operário",
      registro_profissional: "CREA-89012",
      experiencia_profissional: "4 anos de experiência em alvenaria e concretagem."
    },
    {
      id: 10,
      nome: "Paulo Costa",
      cpf: "012.345.678-90",
      email: "paulo.costa@email.com",
      telefone: "(32) 92345-6789",
      endereco: "Rua São João, 123, Juiz de Fora, MG",
      cargo: "Mestre de Obras",
      area_atuacao: "Civil",
      nivel_acesso: "Supervisor",
      registro_profissional: "CREA-90123",
      experiencia_profissional: "9 anos de experiência com obras de infraestrutura e supervisão de equipes."
    },
    {
      id: 11,
      nome: "Felipe Martins",
      cpf: "123.456.789-02",
      email: "felipe.martins@email.com",
      telefone: "(61) 92345-6789",
      endereco: "Setor Sul, 234, Brasília, DF",
      cargo: "Engenheiro Eletricista",
      area_atuacao: "Elétrica",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-11122",
      experiencia_profissional: "10 anos de experiência em instalações elétricas prediais e industriais."
    },
    {
      id: 12,
      nome: "Tatiane Rodrigues",
      cpf: "234.567.890-13",
      email: "tatiane.rodrigues@email.com",
      telefone: "(21) 91234-5679",
      endereco: "Rua das Palmeiras, 555, Rio de Janeiro, RJ",
      cargo: "Mestre de Obras",
      area_atuacao: "Civil",
      nivel_acesso: "Supervisor",
      registro_profissional: "CREA-11223",
      experiencia_profissional: "7 anos de experiência na coordenação de obras e equipes de construção."
    },
    {
      id: 13,
      nome: "Thiago Almeida",
      cpf: "345.678.901-24",
      email: "thiago.almeida@email.com",
      telefone: "(31) 91567-8902",
      endereco: "Rua Marília, 710, Belo Horizonte, MG",
      cargo: "Pedreiro",
      area_atuacao: "Civil",
      nivel_acesso: "Operário",
      registro_profissional: "CREA-12234",
      experiencia_profissional: "3 anos de experiência em construção de fundações e alvenarias."
    },
    {
      id: 14,
      nome: "Joana Ferreira",
      cpf: "456.789.012-35",
      email: "joana.ferreira@email.com",
      telefone: "(41) 92345-6789",
      endereco: "Rua XV de Novembro, 200, Curitiba, PR",
      cargo: "Engenheira Ambiental",
      area_atuacao: "Ambiental",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-13456",
      experiencia_profissional: "5 anos de experiência em projetos ambientais para construção civil."
    },
    {
      id: 15,
      nome: "José Alves",
      cpf: "567.890.123-46",
      email: "jose.alves@email.com",
      telefone: "(61) 91456-7890",
      endereco: "Avenida Central, 333, Brasília, DF",
      cargo: "Pedreiro",
      area_atuacao: "Civil",
      nivel_acesso: "Operário",
      registro_profissional: "CREA-14367",
      experiencia_profissional: "6 anos de experiência em construção de paredes e estruturas de concreto."
    },
    {
      id: 16,
      nome: "Rafael Silva",
      cpf: "678.901.234-57",
      email: "rafael.silva@email.com",
      telefone: "(71) 91890-1235",
      endereco: "Rua São Francisco, 400, Salvador, BA",
      cargo: "Mestre de Obras",
      area_atuacao: "Civil",
      nivel_acesso: "Supervisor",
      registro_profissional: "CREA-15478",
      experiencia_profissional: "11 anos de experiência em coordenação e gestão de obras."
    },
    {
      id: 17,
      nome: "Carla Santos",
      cpf: "789.012.345-78",
      email: "carla.santos@email.com",
      telefone: "(51) 91901-2346",
      endereco: "Rua das Margaridas, 800, Porto Alegre, RS",
      cargo: "Engenheira Civil",
      area_atuacao: "Civil",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-16789",
      experiencia_profissional: "9 anos de experiência com grandes projetos de infraestrutura."
    },
    {
      id: 18,
      nome: "Marcelo Lima",
      cpf: "890.123.456-79",
      email: "marcelo.lima@email.com",
      telefone: "(61) 91789-0124",
      endereco: "Avenida dos Trabalhadores, 250, Brasília, DF",
      cargo: "Pedreiro",
      area_atuacao: "Civil",
      nivel_acesso: "Operário",
      registro_profissional: "CREA-17890",
      experiencia_profissional: "7 anos de experiência em obras de alvenaria e acabamento."
    },
    {
      id: 19,
      nome: "Juliana Costa",
      cpf: "901.234.567-90",
      email: "juliana.costa@email.com",
      telefone: "(71) 92012-3457",
      endereco: "Rua Vitória, 100, Salvador, BA",
      cargo: "Engenheira Civil",
      area_atuacao: "Civil",
      nivel_acesso: "Administrador",
      registro_profissional: "CREA-18901",
      experiencia_profissional: "6 anos de experiência em projetos e fiscalização de obras civis."
    },
    {
      id: 20,
      nome: "Ricardo Barbosa",
      cpf: "012.345.678-91",
      email: "ricardo.barbosa@email.com",
      telefone: "(32) 92234-5678",
      endereco: "Rua do Comércio, 155, Juiz de Fora, MG",
      cargo: "Mestre de Obras",
      area_atuacao: "Civil",
      nivel_acesso: "Supervisor",
      registro_profissional: "CREA-19012",
      experiencia_profissional: "10 anos de experiência na gestão de obras de grande porte."
    }
  ];


  selectCollaborator: any;

  public readonly filterSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    placeholder: 'Procurar'
  };

  @ViewChild('poPageList', { static: true }) poPageList!: PoPageListComponent;
  disclaimerGroup: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.disclaimerGroup = {
      title: 'Filters',
      disclaimers: [],
      change: this.onChangeDisclaimer.bind(this),
      remove: this.onClearDisclaimer.bind(this)
    };
  }

  filterAction(labelFilter: string | Array<string>) {
    const filter = typeof labelFilter === 'string' ? [labelFilter] : [...labelFilter];
    this.populateDisclaimers(filter);
    this.filter();
  }

  disableEditButton() {
    return !this.selectCollaborator;
  }

  onChangeDisclaimer(disclaimers: any) {
    this.disclaimers = disclaimers;
    this.filter();
  }

  onClearDisclaimer(disclaimers: any) {
    if (disclaimers.removedDisclaimer.property === 'search') {
      this.poPageList.clearInputSearch();
    }
    this.disclaimers = [];
    this.filter();
  }

  filter() {
    const filters = this.disclaimers.map((disclaimer: { [x: string]: any; }) => disclaimer['value']);;
  }

  onNewCollaborator() {
    this.router.navigate(['/collaborators/create']);
  }

  onSelectCollaborator(selected: any) {
    this.selectCollaborator = selected;
  }

  onUnselectCollaborator() {
    this.selectCollaborator = undefined;
    this.actions[1].disabled = this.disableEditButton();
    this.actions[2].disabled = this.disableEditButton();
  }
  onShowMore() {}

  populateDisclaimers(filters: Array<any>) {
    const property = filters.length > 1 ? 'advanced' : 'search';
    this.disclaimers = filters.map(value => ({ value, property }));

    if (this.disclaimers && this.disclaimers.length > 0) {
      this.disclaimerGroup.disclaimers = [...this.disclaimers];
    } else {
      this.disclaimerGroup.disclaimers = [];
    }
  }
}
