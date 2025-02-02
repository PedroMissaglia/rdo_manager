import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailyReportService {

  private _dailyReport: any;

  set dailyReport(value: any) {
    this._dailyReport = value;
  }

  get dailyReport() {
    return this._dailyReport;
  }

  constructor() { }
}
