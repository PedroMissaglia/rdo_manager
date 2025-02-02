import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Property to store login status
  private isLoggedIn: boolean = false;
  private _user: any;

  constructor() {}

  // Getter for isLogged
  get isLogged(): boolean {
    return this.isLoggedIn;
  }

  // Setter for isLogged
  set isLogged(value: boolean) {
    this.isLoggedIn = value;
  }

  // Getter for userType
  get user(): any {
    return this._user;
  }

  // Setter for userType
  set user(value: any) {
    this._user = value;
  }

  // Login function: sets isLogged to true and userType to a specific role
  login(): void {
    this.isLoggedIn = true;
  }

  // Logout function: sets isLogged to false and userType to 'guest'
  logout(): void {
    this.isLoggedIn = false;
  }

}
