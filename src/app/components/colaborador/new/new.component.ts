import { Component, OnInit } from '@angular/core';
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
export class NewComponent implements OnInit{

  value = {
    displayName: '',
    login: '',
    password: '',
    type: '',
    cliente: '',
    displayNameCliente: '',
    id: '',
  };
  items: Array<any> = [];
  optionsOperators: Array<any> = [];

  fields: Array<PoDynamicFormField> = [];
  constructor(
    private crudService: CrudService,
    private notificationService: PoNotificationService,
    private collaboratorService: CollaboratorService,
    private router: Router) {}


  ngOnInit(): void {
    this.loadClients();
  }

  onHandleGoBack() {
    this.router.navigate([`collaborators`]);
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
          options: ['Administrador', 'Operador']
        },
      ]

    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  async onHandleSave() {

    const id = this.crudService.generateFirebaseId();
    this.value['id'] = id;
    const cliente = this.optionsOperators.find(option => option.id === this.value['cliente'])
    this.value['displayNameCliente'] = cliente.label;
    const itemAdded = await this.crudService.addItem('user', this.value, id);

    if (itemAdded) {
      this.notificationService.success('Usuário criado com sucesso.');
      this.router.navigate(['collaborators']);
    }

  }
}
