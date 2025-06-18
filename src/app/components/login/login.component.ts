import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageLogin } from '@po-ui/ng-templates';
import { PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {

  logo = 'src/app/login/swl_logo.png';
  literals = {

  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: PoNotificationService,
    private userService: UserService
  ) {}


  async onSubmit(formData: PoPageLogin) {
    const user = await this.authService
      .login(<string>formData.login.trim().toLocaleLowerCase(), formData.password);

    if (!user ) return this.messageError();

    this.userService.user = user;
    this.userService.setUser(user);

    if (
      user.type === 'Administrador' ||
      user.type === 'Cliente' ||
      user.type === 'Fiscal'
    ) {
      this.router.navigate(['home']);
    }

    if (user.type === 'Operador') {
      this.router.navigate(['dailyLog']);
    }
  }

  messageError() {
    return this.notificationService.error('Usuário inválido.');
  }


}


