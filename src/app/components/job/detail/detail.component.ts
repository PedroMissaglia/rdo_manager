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
    { property: 'nome', label: 'Serviço', gridColumns: 10 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12 },
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
