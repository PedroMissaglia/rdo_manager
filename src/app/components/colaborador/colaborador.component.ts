import { CrudService } from './../../services/crud.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoPageAction, PoPageFilter, PoPageListComponent, PoTableColumn } from '@po-ui/ng-components';
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
    { label: 'Visualizar', action: this.onDetailCollaborator.bind(this) ,disabled: this.disableEditButton.bind(this) },
    { label: 'Editar', action: this.onEditCollaborator.bind(this), disabled: this.disableEditButton.bind(this),  },
    { label: 'Excluir', disabled: this.disableEditButton.bind(this)}
  ];

  items: any;
  columns: Array<PoTableColumn> = this.getColumns();
  tableItems = [];

  onDetailCollaborator() {
    this.collaboratorService.collaborator = this.selectCollaborator;
    this.router.navigate([`/job/${this.selectCollaborator['id']}`]);
  }

  onEditCollaborator() {
    this.collaboratorService.collaborator = this.selectCollaborator;
    this.router.navigate([`job/edit/${this.selectCollaborator['id']}`]);
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
    private collaboratorService: CollaboratorService)
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
    this.router.navigate(['/collaborators/create']);
  }

  onSelectCollaborator(selected: any) {
    this.selectCollaborator = selected;
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
      {property: 'password', label: 'Senha'},
      {property: 'type', label: 'Tipo'},
      {property: 'placa', label: 'Placa'},
      {property: 'obra', label: 'Obra'},
      {property: 'uid', label: 'Id'},
    ]
  }
}
