import { PoDynamicViewField } from '@po-ui/ng-components';
import { JobService } from './../job.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit{


   fields: Array<PoDynamicViewField> = [
    { property: 'id', divider: 'Detalhes do serviço', order: 1 },
    { property: 'nome', label: 'Serviço', gridColumns: 10 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12 },
  ];
  logo = '/assets/swl_logo.png'
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

  constructor(
    public jobService: JobService,
    private router: Router) {}


  ngOnInit(): void {
    console.log(this.jobService);
  }


  onHandleGoBack() {
    this.router.navigate([`jobs`]);
  }

}
