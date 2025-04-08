import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Component, inject, OnInit } from '@angular/core';
import { CrudService } from './services/crud.service';
import {
  PoBreadcrumb,
  PoThemeService,
  PoToolbarAction,
  PoToolbarProfile,
} from '@po-ui/ng-components';
import { poThemeSample } from './po-theme.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  items: any[] = []; // Para armazenar os itens do Firestore
  newItem: string = ''; // Para armazenar o novo item a ser adicionado
  editItem: string = ''; // Para armazenar o item editado
  editItemId: string | null = null; // Para armazenar o ID do item que está sendo editado
  profile: PoToolbarProfile = {
    title: '',
  };
  profileActions: Array<PoToolbarAction> = [
    {
      icon: 'an an-sign-out',
      label: 'Sair',
      type: 'danger',
      separator: true,
      action: (item: any) => {
        this.userService.logout();
        this.router.navigate(['login']);
      },
    },
  ];

  constructor(
    private poThemeService: PoThemeService,
    private router: Router,
    public userService: UserService
  ) {
    this.poThemeService.setTheme(poThemeSample);
  } // Injeção do CrudService

  private firestore = inject(Firestore);

  logo = '/assets/swl_logo.png';

  menus = [
    {
      label: 'Início',
      icon: 'an an-file-text',
      link: '/home',
      shortLabel: 'Início',
    },
    {
      label: 'Cadastros',
      icon: 'an an-folder-plus',
      shortLabel: 'Cadastros',
      subItems: [
        { label: 'Cliente', link: '/clients' },
        { label: 'Colaborador', link: '/collaborators' },
        { label: 'Serviço', link: '/jobs' },
      ],
    },
  ];

  ngOnInit(): void {
    this.profile = {
      subtitle: this.userService.getUser()?.login ?? '',
      title: this.userService.getUser()?.displayName ?? '',
    };
  }
}
