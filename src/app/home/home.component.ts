import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  logo = '/assets/swl_logo.png'
  menus = [
    {
      label: 'Home',
      icon: 'ph ph-house',
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
      placa: "ABC-1234",
      obra: "Construção da ponte",
      data: "2024-01-15T08:30:00Z",
      endereco: "Rua das Flores, 123, Centro, SP",
      tipo_de_servico: 1,
      colaboradores: ["João Silva", "Carlos Pereira", "Ana Costa"],
      locomocao: "01:30",
      manutencao: "02:00",
      total_de_horas: "03:30"
    },
    {
      placa: "XYZ-5678",
      obra: "Reforma do prédio",
      data: "2024-02-20T09:00:00Z",
      endereco: "Av. Paulista, 987, São Paulo, SP",
      tipo_de_servico: 2,
      colaboradores: ["Maria Oliveira", "Rafael Martins", "Juliana Almeida"],
      locomocao: "00:45",
      manutencao: "03:00",
      total_de_horas: "03:45"
    },
    {
      placa: "DEF-9012",
      obra: "Instalação elétrica",
      data: "2024-03-05T07:00:00Z",
      endereco: "Rua Rio Branco, 432, RJ",
      tipo_de_servico: 3,
      colaboradores: ["Luís Fernandes", "Ricardo Santos"],
      locomocao: "00:30",
      manutencao: "02:30",
      total_de_horas: "03:00"
    },
    {
      placa: "GHI-3456",
      obra: "Pintura externa",
      data: "2024-04-10T10:00:00Z",
      endereco: "Rua dos Três Rios, 278, RJ",
      tipo_de_servico: 4,
      colaboradores: ["Paula Souza", "Carlos Pereira"],
      locomocao: "01:00",
      manutencao: "01:30",
      total_de_horas: "02:30"
    },
    {
      placa: "JKL-7890",
      obra: "Desentupimento de esgoto",
      data: "2024-05-18T11:00:00Z",
      endereco: "Av. Brasil, 556, Rio de Janeiro, RJ",
      tipo_de_servico: 5,
      colaboradores: ["Ricardo Santos", "Fernanda Lima"],
      locomocao: "00:40",
      manutencao: "02:20",
      total_de_horas: "03:00"
    },
    {
      placa: "LMN-1234",
      obra: "Reparação de telhado",
      data: "2024-06-05T08:30:00Z",
      endereco: "Rua XV de Novembro, 430, Curitiba, PR",
      tipo_de_servico: 1,
      colaboradores: ["Carlos Pereira", "Paula Souza"],
      locomocao: "00:50",
      manutencao: "03:00",
      total_de_horas: "03:50"
    },
    {
      placa: "OPQ-5678",
      obra: "Construção de muro",
      data: "2024-07-10T09:00:00Z",
      endereco: "Av. Rio Branco, 345, Porto Alegre, RS",
      tipo_de_servico: 2,
      colaboradores: ["João Silva", "Luís Fernandes"],
      locomocao: "00:55",
      manutencao: "02:30",
      total_de_horas: "03:25"
    },
    {
      placa: "RST-9012",
      obra: "Instalação de sistema de segurança",
      data: "2024-08-15T10:00:00Z",
      endereco: "Rua das Acácias, 876, Belo Horizonte, MG",
      tipo_de_servico: 3,
      colaboradores: ["Ricardo Santos", "Juliana Almeida"],
      locomocao: "00:30",
      manutencao: "02:15",
      total_de_horas: "02:45"
    },
    {
      placa: "UVW-3456",
      obra: "Pintura de fachada",
      data: "2024-09-20T11:00:00Z",
      endereco: "Rua das Palmeiras, 210, Fortaleza, CE",
      tipo_de_servico: 4,
      colaboradores: ["Maria Oliveira", "Rafael Martins"],
      locomocao: "01:00",
      manutencao: "02:30",
      total_de_horas: "03:30"
    },
    {
      placa: "XYZ-7890",
      obra: "Construção de piscina",
      data: "2024-10-25T07:30:00Z",
      endereco: "Rua Dona Laura, 543, Natal, RN",
      tipo_de_servico: 5,
      colaboradores: ["Paula Souza", "Carlos Pereira"],
      locomocao: "00:45",
      manutencao: "03:00",
      total_de_horas: "03:45"
    },
    {
      placa: "ABC-2468",
      obra: "Serragem de madeira",
      data: "2024-11-02T08:15:00Z",
      endereco: "Av. São João, 990, São Paulo, SP",
      tipo_de_servico: 1,
      colaboradores: ["João Silva", "Ricardo Santos"],
      locomocao: "00:40",
      manutencao: "02:15",
      total_de_horas: "02:55"
    },
    {
      placa: "DEF-1357",
      obra: "Construção de casa",
      data: "2024-12-05T09:30:00Z",
      endereco: "Rua das Laranjeiras, 345, Curitiba, PR",
      tipo_de_servico: 2,
      colaboradores: ["Ana Costa", "Luís Fernandes"],
      locomocao: "00:50",
      manutencao: "03:30",
      total_de_horas: "04:20"
    },
    {
      placa: "GHI-2468",
      obra: "Reparação hidráulica",
      data: "2024-01-22T10:00:00Z",
      endereco: "Rua das Flores, 120, São Paulo, SP",
      tipo_de_servico: 3,
      colaboradores: ["Ricardo Santos", "Juliana Almeida"],
      locomocao: "00:45",
      manutencao: "02:20",
      total_de_horas: "03:05"
    },
    {
      placa: "JKL-9876",
      obra: "Substituição de pisos",
      data: "2024-02-18T08:30:00Z",
      endereco: "Av. Brasil, 220, Rio de Janeiro, RJ",
      tipo_de_servico: 4,
      colaboradores: ["Carlos Pereira", "Paula Souza"],
      locomocao: "00:35",
      manutencao: "02:40",
      total_de_horas: "03:15"
    },
    {
      placa: "MNO-1122",
      obra: "Instalação de ar condicionado",
      data: "2024-03-14T09:00:00Z",
      endereco: "Rua dos Três Rios, 444, Recife, PE",
      tipo_de_servico: 5,
      colaboradores: ["Luís Fernandes", "Rafael Martins"],
      locomocao: "00:50",
      manutencao: "02:00",
      total_de_horas: "02:50"
    },
    {
      placa: "PQR-3344",
      obra: "Reparo de rede elétrica",
      data: "2024-04-02T08:00:00Z",
      endereco: "Rua do Sol, 789, Porto Alegre, RS",
      tipo_de_servico: 1,
      colaboradores: ["Maria Oliveira", "Carlos Pereira"],
      locomocao: "00:55",
      manutencao: "02:50",
      total_de_horas: "03:45"
    },
    {
      placa: "STU-5566",
      obra: "Construção de muros",
      data: "2024-05-10T10:30:00Z",
      endereco: "Av. São João, 233, Belo Horizonte, MG",
      tipo_de_servico: 2,
      colaboradores: ["Ricardo Santos", "Paula Souza"],
      locomocao: "01:00",
      manutencao: "02:30",
      total_de_horas: "03:30"
    },
    {
      placa: "VWX-7788",
      obra: "Troca de janelas",
      data: "2024-06-20T11:00:00Z",
      endereco: "Rua Paulista, 1000, São Paulo, SP",
      tipo_de_servico: 3,
      colaboradores: ["João Silva", "Ana Costa"],
      locomocao: "00:45",
      manutencao: "02:20",
      total_de_horas: "03:05"
    },
    {
      placa: "YZA-9900",
      obra: "Instalação de portões",
      data: "2024-07-15T08:30:00Z",
      endereco: "Rua Rio Branco, 765, Fortaleza, CE",
      tipo_de_servico: 4,
      colaboradores: ["Rafael Martins", "Carlos Pereira"],
      locomocao: "00:40",
      manutencao: "02:30",
      total_de_horas: "03:10"
    },
    {
      placa: "BCD-1122",
      obra: "Construção de galpão",
      data: "2024-08-25T09:00:00Z",
      endereco: "Av. Brasília, 400, Curitiba, PR",
      tipo_de_servico: 5,
      colaboradores: ["Paula Souza", "Ricardo Santos"],
      locomocao: "01:10",
      manutencao: "03:00",
      total_de_horas: "04:10"
    },
    {
      placa: "EFG-2233",
      obra: "Instalação de iluminação pública",
      data: "2024-09-30T10:15:00Z",
      endereco: "Rua das Palmeiras, 99, Belo Horizonte, MG",
      tipo_de_servico: 1,
      colaboradores: ["Juliana Almeida", "Rafael Martins"],
      locomocao: "00:50",
      manutencao: "02:40",
      total_de_horas: "03:30"
    },
    {
      placa: "HIJ-3344",
      obra: "Reparo de aquecedor",
      data: "2024-10-14T09:30:00Z",
      endereco: "Rua do Sol, 500, Recife, PE",
      tipo_de_servico: 2,
      colaboradores: ["Carlos Pereira", "Ana Costa"],
      locomocao: "00:55",
      manutencao: "03:00",
      total_de_horas: "03:55"
    }
  ];

  onShowMore() {}
}
