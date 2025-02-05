import { Component, inject, ViewChild } from '@angular/core';
import { addDoc, collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PoDynamicViewField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { JobService } from './job.service';
import { CrudService } from '../../services/crud.service';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrl: './job.component.scss',
    standalone: false
})
export class JobComponent {

  selectService: any;
  public actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onNewService.bind(this) },
    { label: 'Visualizar', action: this.onDetailService.bind(this) ,disabled: this.disableEditButton.bind(this) },
    { label: 'Editar', action: this.onEditService.bind(this), disabled: this.disableEditButton.bind(this),  },
    { label: 'Excluir', action: this.onDeleteService.bind(this) ,disabled: this.disableEditButton.bind(this) }
  ];
  fields: Array<PoDynamicViewField> = [
    { property: 'nome', label: 'Serviço', gridColumns: 10 },
    { property: 'descricao', label: 'Descrição', gridColumns: 12 },
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
        'service',
        this.jobService.job['id'],
      );
      this.poModal.close();
      this.notificationService.success('Serviço excluído com sucesso.');
    },
    label: 'Confirmar',
  };

  constructor(
    private router: Router,
    private notificationService: PoNotificationService,
    public jobService: JobService,
    private crudService: CrudService) {}

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      this.items = await this.crudService.getItems('service');
     this.tableItems = this.items;
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  onNewService() {
    this.router.navigate(['/job/create']);
  }

  onDetailService() {
    this.jobService.job = this.selectService;
    this.router.navigate([`/job/${this.selectService['id']}`]);
  }

  onEditService() {
    this.jobService.job = this.selectService;
    this.router.navigate([`job/edit/${this.selectService['id']}`]);
  }

  onDeleteService() {
    this.jobService.job = this.selectService;
    this.poModal.open();
  }

  disableEditButton() {
    return !this.selectService;
  }

  onSelectService(selected: any) {
    this.selectService = selected;
    this.actions[1].disabled = this.disableEditButton();
    this.actions[2].disabled = this.disableEditButton();
  }

  onUnselectService() {
    this.selectService = undefined;
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
      {property: 'descricao', label: 'Descrição'}
    ]
  }

  onShowMore() {}




}
