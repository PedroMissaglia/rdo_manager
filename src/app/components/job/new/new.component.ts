import { Component } from '@angular/core';
import { CrudService } from '../../../services/crud.service';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new',
    standalone: false,
    templateUrl: './new.component.html',
    styleUrl: './new.component.scss'
})
export class NewComponent {

  value = {
    id: '',
    nome: '',
    descricao: '',
  };
  fields: Array<PoDynamicFormField> = [
    { property: 'nome', label: 'Serviço', gridColumns: 8 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12, rows: 3 },
  ];

  constructor(
    private crudService: CrudService,
    private notificationService: PoNotificationService,
    private router: Router) {}


  onHandleGoBack() {
    this.router.navigate([`jobs`]);
  }

  async onHandleSave() {
    const itemAdded = await this.crudService.addItem('service', this.value);

    if (itemAdded) {
      this.notificationService.success('Serviço criado com sucesso.');
      this.router.navigate(['jobs']);
    }
  }
}
