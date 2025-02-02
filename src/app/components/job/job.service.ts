import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private _job: any;

  set job(value: any) {
    this._job = value;
  }

  get job() {
    return this._job;
  }

  constructor() { }


}
