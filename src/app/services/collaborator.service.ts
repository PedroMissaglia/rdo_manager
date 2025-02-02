import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  private _collaborator: any;
  set collaborator(value: any) {
    this._collaborator = value;
  }

  get collaborator() {
    return this._collaborator;
  }

  constructor() { }


}
