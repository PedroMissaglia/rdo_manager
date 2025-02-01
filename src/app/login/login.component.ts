import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {

  logo = 'src/app/login/swl_logo.png'

  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['home']);
  }
}
