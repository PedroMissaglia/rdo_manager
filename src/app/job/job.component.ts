import { Component } from '@angular/core';
import { PoPageAction } from '@po-ui/ng-components';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrl: './job.component.scss',
    standalone: false
})
export class JobComponent {

  logo = '/assets/swl_logo.png'
  public readonly actions: Array<PoPageAction> = [
    { label: 'Editar' },
    { label: 'Excluir' }
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
    { id: 1, nome: "Limpeza do terreno", descricao: "Retirada de entulhos, materiais e preparação do terreno para início da obra." },
    { id: 2, nome: "Fundações", descricao: "Escavação e concretagem da fundação do prédio, preparação do solo para construção." },
    { id: 3, nome: "Alvenaria", descricao: "Construção de paredes, muros, divisórias e estrutura de alvenaria." },
    { id: 4, nome: "Pintura", descricao: "Aplicação de pintura em paredes internas e externas, acabamento e finalização." },
    { id: 5, nome: "Instalações elétricas", descricao: "Instalação de fiação, tomadas, interruptores, quadros de distribuição e sistema de iluminação." },
    { id: 6, nome: "Instalações hidráulicas", descricao: "Instalação de tubulações de água, esgoto, gás e outros sistemas hidráulicos." },
    { id: 7, nome: "Pavimentação", descricao: "Execução de pavimentos de asfalto ou blocos intertravados em áreas externas." },
    { id: 8, nome: "Escavação", descricao: "Escavação de terrenos para fundação ou outros fins." },
    { id: 9, nome: "Montagem de estrutura metálica", descricao: "Instalação de estruturas metálicas como vigas e colunas." },
    { id: 10, nome: "Revestimento de paredes", descricao: "Aplicação de revestimentos de argamassa ou outros materiais para acabamento de paredes." },
    { id: 11, nome: "Colocação de telhado", descricao: "Instalação de telhado, incluindo vigas e coberturas." },
    { id: 12, nome: "Instalação de esquadrias", descricao: "Instalação de portas e janelas em alvenaria ou estrutura metálica." },
    { id: 13, nome: "Forro", descricao: "Instalação de forros de gesso ou outro material." },
    { id: 14, nome: "Impermeabilização", descricao: "Aplicação de produtos para impedir a penetração de água em paredes e fundações." },
    { id: 15, nome: "Instalação de elevadores", descricao: "Instalação de sistema de elevadores, cabos e controles." },
    { id: 16, nome: "Reparo de estruturas", descricao: "Reparo em estruturas de concreto ou metálicas danificadas." },
    { id: 17, nome: "Instalação de sistemas de ar-condicionado", descricao: "Instalação de sistemas de climatização e equipamentos de ar-condicionado." },
    { id: 18, nome: "Reforma de fachadas", descricao: "Reparo e pintura de fachadas de edifícios." },
    { id: 19, nome: "Serralheria", descricao: "Instalação e reparo de estruturas metálicas, como grades e portões." },
    { id: 20, nome: "Rede de drenagem", descricao: "Instalação de redes de drenagem de águas pluviais e esgoto." },
    { id: 21, nome: "Pisos e revestimentos", descricao: "Instalação de pisos cerâmicos, vinílicos, ou outros materiais de revestimento." },
    { id: 22, nome: "Instalação de sistemas de gás", descricao: "Instalação de rede de gás e equipamentos relacionados." },
    { id: 23, nome: "Manutenção de equipamentos", descricao: "Manutenção de equipamentos de construção, como betoneiras e guindastes." },
    { id: 24, nome: "Montagem de andaimes", descricao: "Montagem e desmontagem de andaimes para acesso aos andares superiores." },
    { id: 25, nome: "Instalação de sistemas de segurança", descricao: "Instalação de câmeras de segurança, alarmes e sistemas de controle de acesso." },
    { id: 26, nome: "Desmonte de estruturas", descricao: "Retirada de estruturas antigas ou temporárias da obra." },
    { id: 27, nome: "Revestimento de pisos", descricao: "Instalação de revestimento de pisos, como cerâmica, madeira ou outros." },
    { id: 28, nome: "Controle de qualidade", descricao: "Verificação da qualidade dos materiais e serviços executados na obra." },
    { id: 29, nome: "Controle de segurança", descricao: "Garantia das condições de segurança na obra e uso de EPIs." },
    { id: 30, nome: "Movimentação de materiais", descricao: "Transporte e distribuição de materiais na obra." }
  ];

  onShowMore() {}




}
