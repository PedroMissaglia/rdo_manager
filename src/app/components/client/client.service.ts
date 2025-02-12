import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private _client: any;

  set client(value: any) {
    this._client = value;
  }

  get client() {
    return this._client;
  }

  constructor() { }


}
