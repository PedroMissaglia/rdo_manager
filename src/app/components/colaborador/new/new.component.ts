import { Component } from '@angular/core';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { CollaboratorService } from '../../../services/collaborator.service';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';
import { IUser } from '../../../interfaces/user.interface';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrl: './new.component.scss',
    standalone: false
})
export class NewComponent {
  value: IUser = {
    createdAt: new Date(),
    displayName: '',
    login: '',
    password: '',
    type: '',
    id: '',
  };
  fields: Array<PoDynamicFormField> = [
    { property: 'displayName', divider: 'detalhes', order: 1, gridColumns: 4 },
    { property: 'login', label: 'Login', gridColumns: 8 },
    { property: 'password', label: 'Senha', gridColumns: 12},
    { property: 'placa', label: 'Placa', gridColumns:4 },
    { property: 'cliente', label: 'Cliente', gridColumns: 8},
    { property: 'type', label: 'Tipo', gridColumns: 6,       optional: false,
      options: ['Administrador', 'Operador']
    },
  ];

  constructor(
    private crudService: CrudService,
    private notificationService: PoNotificationService,
    private collaboratorService: CollaboratorService,
    private router: Router) {}


  onHandleGoBack() {
    this.router.navigate([`collaborators`]);
  }

  async onHandleSave() {

    const itemAdded = await this.crudService.addItem('user', this.value);

    if (itemAdded) {

      this.collaboratorService.collaborator = itemAdded;

      const updatedItem = await this.crudService.updateItem(
        'user',
        this.collaboratorService.collaborator.id,
        {
          id: this.collaboratorService.collaborator.id
        }
      );

      if (updatedItem) {
        this.notificationService.success('Usuário criado com sucesso.');
        this.router.navigate(['collaborators']);
      }

    }
  }


}
