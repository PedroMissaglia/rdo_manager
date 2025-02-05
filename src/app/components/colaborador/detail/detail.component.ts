import { Component } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';
import { CollaboratorService } from '../../../services/collaborator.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss',
    standalone: false
})
export class DetailComponent {

  fields: Array<PoDynamicViewField> = [
    { property: 'displayName', divider: 'detalhes', order: 1, gridColumns: 4 },
    { property: 'login', label: 'Login', gridColumns: 8 },
    { property: 'placa', label: 'Placa', gridColumns:4},
    { property: 'cliente', label: 'Cliente', gridColumns: 8},
    { property: 'type', label: 'Tipo', gridColumns: 6,
      options: [{label: 'Administrador', value: 'Administrador'}, {label: 'Operador', value: 'Operador'}]
    },
  ];

  constructor(
    public collaboratorService: CollaboratorService,
    private router: Router) {}


  ngOnInit(): void {
  }


  onHandleGoBack() {
    this.router.navigate([`collaborators`]);
  }
}
