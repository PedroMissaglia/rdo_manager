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
    uid: '',
  };
  fields: Array<PoDynamicFormField> = [
    { property: 'login', divider: 'Detalhes do colaborador', order: 1, gridColumns: 6 },
    { property: 'senha', hidePasswordPeek: true ,order: 1, gridColumns: 6 },
    { property: 'displayName', label: 'Nome', gridColumns: 6 },
    { property: 'type', label: 'Tipo', gridColumns: 6,       optional: false,
      options: ['Administrador', 'Operador']
    },
    { property: 'obra', label: 'Obra', gridColumns: 6  },
  ];

  constructor(
    private crudService: CrudService,
    private notificationService: PoNotificationService,
    private router: Router) {}


  onHandleGoBack() {
    this.router.navigate([`collaborators`]);
  }

  async onHandleSave() {
    const itemAdded = await this.crudService.addItem('user', this.value);

    if (itemAdded) {
      this.notificationService.success('Usuário criado com sucesso.');
    }
  }


}
