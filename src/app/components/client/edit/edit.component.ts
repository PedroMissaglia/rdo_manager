import { Component } from '@angular/core';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { CrudService } from '../../../services/crud.service';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    standalone: false
})
export class EditComponent {
  value: any;
  fields: Array<PoDynamicFormField> = [
    { property: 'nome', label: 'Cliente', gridColumns: 8 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12, rows: 3 },
    { property: 'prazo', label: 'Prazo', gridColumns: 4, type: 'date', format: 'dd/MM/yyyy'  },
  ];

  constructor(
    private clientService: ClientService,
    private notificationService: PoNotificationService,
    private crudService: CrudService,
    private router: Router) {}

  ngOnInit() {
    this.value = this.clientService.client;
  }

  onHandleGoBack() {
    this.router.navigate([`clients`]);
  }

  async onHandleSave() {

    if (this.clientService.client['$selected']) {
      delete this.clientService.client['$selected'];
    }

    const updatedItem = await this.crudService.updateItem(
      'client',
      this.clientService.client['id'],
      this.clientService.client
    );

    if (updatedItem) {
      this.notificationService.success('Cliente alterado com sucesso.');
      this.router.navigate(['clients']);
    }
  }
}
