import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDailyReportComponent } from './detail-daily-report.component';

describe('DetailDailyReportComponent', () => {
  let component: DetailDailyReportComponent;
  let fixture: ComponentFixture<DetailDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDailyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
