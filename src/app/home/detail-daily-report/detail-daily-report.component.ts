import { DailyReportService } from './../daily-report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-daily-report',
  templateUrl: './detail-daily-report.component.html',
  styleUrl: './detail-daily-report.component.scss'
})
export class DetailDailyReportComponent implements OnInit{

  fields: any;
  constructor(private dailyReportService: DailyReportService) {}

  ngOnInit(): void {

    this.dailyReportService.item
  }
}
