import { CrudService } from './../../services/crud.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDynamicViewField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoPageFilter, PoPageListComponent, PoTableColumn } from '@po-ui/ng-components';
import { CollaboratorService } from '../../services/collaborator.service';

@Component({
    selector: 'app-colaborador',
    templateUrl: './colaborador.component.html',
    styleUrl: './colaborador.component.scss',
    standalone: false
})
export class ColaboradorComponent implements OnInit{

  private disclaimers: any = [];
  public actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.onNewCollaborator.bind(this) },
    { label: 'Visualizar', action: this.onDetailCollaborator.bind(this), disabled: this.disableEditButton.bind(this) },
    { label: 'Editar', action: this.onEditCollaborator.bind(this), disabled: this.disableEditButton.bind(this),  },
    { label: 'Excluir', action: this.onDeleteCollaborator.bind(this), disabled: this.disableEditButton.bind(this)}
  ];

  fields: Array<PoDynamicViewField> = [
    { property: 'displayName', order: 1, gridColumns: 4 },
    { property: 'login', label: 'Login', gridColumns: 8 },
    { property: 'placa', label: 'Placa', gridColumns:4 },
    { property: 'displayNameCliente', label: 'Cliente', gridColumns: 8},
    { property: 'type', label: 'Tipo', gridColumns: 6,
      options: [
        {label: 'Administrador', value: 'Administrador'},
        {label: 'Operador', value: 'Operador'},
        {label: 'Cliente', value: 'Cliente'},
        {label: 'Fiscal', value: 'Fiscal'},
      ]
    },
  ];

  @ViewChild(PoModalComponent, { static: false })
  poModal!: PoModalComponent;

  close: PoModalAction = {
    action: () => {
      this.poModal?.close();
    },
    label: 'Cancelar',
    danger: true,
  };

  confirm: PoModalAction = {
    action: async () => {
      const deletedItem = await this.crudService
        .deleteItem('user', this.collaboratorService.collaborator['id']);

      await this.loadItems();

      this.poModal.close();
      this.notificationService.success('Colaborador excluído com sucesso');

      const currentUrl = this.router.url;
      this.router.navigateByUrl('/collaborators', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl(currentUrl);
      });
    },
    label: 'Confirmar',
  };

  items: any;
  columns: Array<PoTableColumn> = this.getColumns();
  tableItems = [];

  onDetailCollaborator() {
    this.collaboratorService.collaborator = this.selectCollaborator;
    this.router.navigate([`/collaborator/${this.selectCollaborator['uid']}`]);
  }

  onEditCollaborator() {
    this.collaboratorService.collaborator = this.selectCollaborator;
    this.router.navigate([`collaborator/edit/${this.selectCollaborator['uid']}`]);
  }

  onDeleteCollaborator() {
    this.collaboratorService.collaborator = this.selectCollaborator;
    this.poModal.open();
  }

  selectCollaborator: any;

  public readonly filterSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    placeholder: 'Procurar'
  };

  @ViewChild('poPageList', { static: true }) poPageList!: PoPageListComponent;
  disclaimerGroup: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private notificationService: PoNotificationService,
    public collaboratorService: CollaboratorService)
  {}

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      this.items = await this.crudService.getItems('user');
      this.tableItems = this.items;
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  filterAction(labelFilter: string | Array<string>) {
    const filter = typeof labelFilter === 'string' ? [labelFilter] : [...labelFilter];
    this.populateDisclaimers(filter);
    this.filter();
  }

  disableEditButton() {
    return !this.selectCollaborator;
  }

  onChangeDisclaimer(disclaimers: any) {
    this.disclaimers = disclaimers;
    this.filter();
  }

  onClearDisclaimer(disclaimers: any) {
    if (disclaimers.removedDisclaimer.property === 'search') {
      this.poPageList.clearInputSearch();
    }
    this.disclaimers = [];
    this.filter();
  }

  filter() {
    const filters = this.disclaimers.map((disclaimer: { [x: string]: any; }) => disclaimer['value']);;
  }

  onNewCollaborator() {
    this.router.navigate(['/collaborator/create']);
  }

  onSelectCollaborator(selected: any) {
    this.selectCollaborator = selected;
    this.actions[1].disabled = this.disableEditButton();
    this.actions[2].disabled = this.disableEditButton();
  }

  onUnselectCollaborator() {
    this.selectCollaborator = undefined;
    this.actions[1].disabled = this.disableEditButton();
    this.actions[2].disabled = this.disableEditButton();
  }
  onShowMore() {}

  populateDisclaimers(filters: Array<any>) {
    const property = filters.length > 1 ? 'advanced' : 'search';
    this.disclaimers = filters.map(value => ({ value, property }));

    if (this.disclaimers && this.disclaimers.length > 0) {
      this.disclaimerGroup.disclaimers = [...this.disclaimers];
    } else {
      this.disclaimerGroup.disclaimers = [];
    }
  }

  getColumns(): PoTableColumn[] {
    return [
      {property: 'displayName', label: 'Nome'},
      {property: 'login', label: 'Login'},
      {property: 'type', label: 'Tipo'},
      {property: 'placa', label: 'Placa'},
      {property: 'displayNameCliente', label: 'Cliente'}
    ]
  }
}
