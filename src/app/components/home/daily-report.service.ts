import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailyReportService {

  item: any;
  itemFilteredByPlate: any;
  constructor() { }
}
