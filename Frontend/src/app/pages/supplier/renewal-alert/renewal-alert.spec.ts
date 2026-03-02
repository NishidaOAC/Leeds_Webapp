import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalAlert } from './renewal-alert';

describe('RenewalAlert', () => {
  let component: RenewalAlert;
  let fixture: ComponentFixture<RenewalAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewalAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
