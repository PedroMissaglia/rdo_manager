import { Component } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
    standalone: false
})
export class DetailComponent {

  fields: Array<PoDynamicViewField> = [
    { property: 'nome', label: 'Cliente', gridColumns: 10 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12 },
    { property: 'prazo', label: 'Prazo', gridColumns: 4, format: 'dd/MM/yyyy', type: 'date' },
  ];

  constructor(
    public clientService: ClientService,
    private router: Router) {}


  ngOnInit(): void {
  }


  onHandleGoBack() {
    this.router.navigate([`clients`]);
  }
}
