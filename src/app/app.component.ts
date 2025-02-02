import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Component, inject, OnInit } from '@angular/core';
import { CrudService } from './services/crud.service';
import { PoBreadcrumb, PoThemeService } from '@po-ui/ng-components';
import { poThemeSample } from './po-theme.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: any[] = []; // Para armazenar os itens do Firestore
  newItem: string = ''; // Para armazenar o novo item a ser adicionado
  editItem: string = ''; // Para armazenar o item editado
  editItemId: string | null = null; // Para armazenar o ID do item que está sendo editado

  constructor(
    private poThemeService: PoThemeService,
    public userService: UserService) {
    this.poThemeService.setTheme(poThemeSample)
  } // Injeção do CrudService

  private firestore = inject(Firestore);


  logo = '/assets/swl_logo.png';

  menus = [
    {
      label: 'Início',
      icon: 'an an-file-text',
      link: '/home',
      shortLabel: 'Início'
    },
    {
      label: 'Cadastros',
      icon: 'an an-folder-plus',
      shortLabel: 'Cadastros',
      subItems: [
        { label: 'Serviço', link: '/jobs' },
        { label: 'Colaborador', link: '/collaborators' }
      ]
    },
    {
      label: 'Daily Log',
      icon: 'an an-folder-plus',
      shortLabel: 'Daily Log',
      link: '/dailyLog',
    }
  ];

  ngOnInit(): void {

  }

}
