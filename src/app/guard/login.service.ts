import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  // Aqui, você pode substituir pelo seu método de verificação de autenticação
  private isLoggedIn: boolean = false; // Defina sua variável de controle (ex.: a partir de um serviço)

  constructor(
    private router: Router,
    private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {


  if(this.userService.isLoggedIn()) {
    if (this.userService.getUser().type === 'Administrador') {
      this.router.navigate(['/home']);
    }
    else {
      this.router.navigate(['/dailyLog']);
    }
    return false;
    } else {
      // Redireciona para a página de login ou qualquer outra página desejada

      return true;
    }
  }
}
