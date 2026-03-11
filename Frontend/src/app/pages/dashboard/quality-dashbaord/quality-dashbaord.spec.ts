import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityDashbaord } from './quality-dashbaord';

describe('QualityDashbaord', () => {
  let component: QualityDashbaord;
  let fixture: ComponentFixture<QualityDashbaord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityDashbaord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityDashbaord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
