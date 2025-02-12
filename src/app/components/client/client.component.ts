import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoDynamicViewField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { CrudService } from '../../services/crud.service';
import { JobService } from '../job/job.service';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { ClientService } from './client.service';

@Component({
  selector: 'app-client',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  selectClient: any;
  public actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onNewClient.bind(this) },
    { label: 'Visualizar', action: this.onDetailClient.bind(this) ,disabled: this.disableEditButton.bind(this) },
    { label: 'Editar', action: this.onEditClient.bind(this), disabled: this.disableEditButton.bind(this),  },
    { label: 'Excluir', action: this.onDeleteClient.bind(this) ,disabled: this.disableEditButton.bind(this) }
  ];
  fields: Array<PoDynamicViewField> = [
    { property: 'nome', label: 'Cliente', gridColumns: 4 },
    { property: 'descricao', label: 'Descrição', gridColumns: 6 },
    { property: 'prazo', label: 'Prazo', gridColumns: 4, type: 'date', format: 'dd/MM/yyyy' },
  ];
  items: any;
  tableItems = [];
  private firestore = inject(Firestore);
  columns: Array<PoTableColumn> = this.getColumns();
  @ViewChild(PoModalComponent)
  poModal!: PoModalComponent;

  close: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: 'Cancelar',
    danger: true,
  };

  confirm: PoModalAction = {
    action: async () => {

      const updatedItem = await this.crudService.deleteItem(
        'client',
        this.clientService.client['id'],
      );
      this.poModal.close();
      this.notificationService.success('Cliente excluído com sucesso.');
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/clients', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl(currentUrl);
      });
    },
    label: 'Confirmar',
  };

  constructor(
    private router: Router,
    private notificationService: PoNotificationService,
    public clientService: ClientService,
    private crudService: CrudService) {}

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      this.items = await this.crudService.getItems('client');
     this.tableItems = this.items;
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  onNewClient() {
    this.router.navigate(['/client/create']);
  }

  onDetailClient() {
    this.clientService.client = this.selectClient;
    this.router.navigate([`/client/${this.selectClient['id']}`]);
  }

  onEditClient() {
    this.clientService.client = this.selectClient;
    this.router.navigate([`client/edit/${this.selectClient['id']}`]);
  }

  onDeleteClient() {
    this.clientService.client = this.selectClient;
    this.poModal.open();
  }

  disableEditButton() {
    return !this.selectClient;
  }

  onSelectClient(selected: any) {
    this.selectClient = selected;
    this.actions[1].disabled = this.disableEditButton();
    this.actions[2].disabled = this.disableEditButton();
  }

  onUnselectClient() {
    this.selectClient = undefined;
    this.actions[1].disabled = this.disableEditButton();
    this.actions[2].disabled = this.disableEditButton();
  }


  async addItem(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
      return docRef;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  }

  getColumns(): Array<PoTableColumn> {
    return [
      {property: 'nome', label: 'Nome'},
      {property: 'descricao', label: 'Descrição'},
      {property: 'prazo', label: 'Prazo', type: 'date', format: 'dd/MM/yyyy' },
    ]
  }

  onShowMore() {}



}
