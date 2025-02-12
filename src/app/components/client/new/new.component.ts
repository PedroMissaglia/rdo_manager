import { Component } from '@angular/core';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';
import { IUser } from '../../../interfaces/user.interface';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrl: './new.component.scss',
    standalone: false
})
export class NewComponent {

  value = {
    id: '',
    nome: '',
    descricao: '',
    prazo: '',

  };
  fields: Array<PoDynamicFormField> = [
    { property: 'nome', label: 'Cliente', gridColumns: 8 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12, rows: 3 },
    { property: 'prazo', label: 'Prazo', gridColumns: 4, type: 'date' },

  ];

  constructor(
    private crudService: CrudService,
    private notificationService: PoNotificationService,
    private clientService: ClientService,
    private router: Router) {}


  onHandleGoBack() {
    this.router.navigate([`clients`]);
  }

  async onHandleSave() {

    const id = this.crudService.generateFirebaseId();
    this.value['id'] = id;
    const itemAdded = await this.crudService.addItem('client', this.value, id);

    if (itemAdded) {
      this.notificationService.success('Usuário criado com sucesso.');
      this.router.navigate(['clients']);
    }

  }
}
