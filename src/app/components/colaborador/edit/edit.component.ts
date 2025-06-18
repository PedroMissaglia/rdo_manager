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
  optionsOperators: any[] = [] ;
  items: any[] = [];
  fields: Array<PoDynamicFormField> = [];

  constructor(
    private collaboratorService: CollaboratorService,
    private notificationService: PoNotificationService,
    private crudService: CrudService,
    private router: Router) {}

  ngOnInit() {
    this.value = this.collaboratorService.collaborator;
    this.loadClients();
  }

  async loadClients() {
    try {
      this.items = await this.crudService.getItems('client', 100);
      this.items.map((user: any) => {
        user.value = user.id;
        user.label = user.nome;
      });
      this.optionsOperators = [...this.items];

      this.fields = [
        { property: 'displayName', label: 'Nome',divider: 'detalhes', order: 1, gridColumns: 4 },
        { property: 'login', label: 'Login', gridColumns: 8 },
        { property: 'password', label: 'Senha', gridColumns: 12, secret: true, hidePasswordPeek: false},
        { property: 'placa', label: 'Placa', gridColumns:4 },
        { property: 'cliente', label: 'Cliente', gridColumns: 8, options: this.optionsOperators, fieldLabel: 'label', fieldValue: 'id'},
        { property: 'type', label: 'Tipo', gridColumns: 6, optional: false,
          options: ['Administrador', 'Operador', 'Fiscal', 'Cliente']
        },
      ]

    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  onHandleGoBack() {
    this.router.navigate([`collaborators`]);
  }

  async onHandleSave() {

    if (this.collaboratorService.collaborator['$selected']) {
      delete this.collaboratorService.collaborator['$selected'];
    }

    this.collaboratorService.collaborator["displayNameCliente"] = this.optionsOperators.find(cliente => cliente.id === this.collaboratorService.collaborator["cliente"])?.nome;

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
