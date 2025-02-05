import { Component } from '@angular/core';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { CollaboratorService } from '../../../services/collaborator.service';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    standalone: false
})
export class EditComponent {
  value: any;
  fields: Array<PoDynamicFormField> = [
    { property: 'displayName', divider: 'detalhes', order: 1, disabled: true, gridColumns: 4 },
    { property: 'login', label: 'Login', disabled: true, gridColumns: 8 },
    { property: 'password', label: 'Senha', gridColumns: 12, secret: true, hidePasswordPeek: true},
    { property: 'placa', label: 'Placa', gridColumns:4 },
    { property: 'cliente', label: 'Cliente', gridColumns: 8},
    { property: 'type', label: 'Tipo', gridColumns: 6,       optional: false,
      options: ['Administrador', 'Operador']
    },
  ];

  constructor(
    private collaboratorService: CollaboratorService,
    private notificationService: PoNotificationService,
    private crudService: CrudService,
    private router: Router) {}

  ngOnInit() {
    this.value = this.collaboratorService.collaborator;
  }

  onHandleGoBack() {
    this.router.navigate([`collaborators`]);
  }

  async onHandleSave() {

    if (this.collaboratorService.collaborator['$selected']) {
      delete this.collaboratorService.collaborator['$selected'];
    }

    const updatedItem = await this.crudService.updateItem(
      'user',
      this.collaboratorService.collaborator['id'],
      this.collaboratorService.collaborator
    );

    if (updatedItem) {
      this.notificationService.success('Colaborador alterado com sucesso.');
      this.router.navigate(['collaborators']);
    }
  }
}
