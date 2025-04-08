import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Property to store login status
  private _user: any;

  constructor() {}

  // Getter for userType
  get user(): any {
    return this._user;
  }

  // Setter for userType
  set user(value: any) {
    this._user = value;
  }

  // Salvar usuário no cache (sessionStorage)
  setUser(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // Recuperar usuário do cache
  getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Verificar se o usuário está logado
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  // Logout function: sets isLogged to false and userType to 'guest'
  logout(): void {
    sessionStorage.removeItem('user');
  }

}
