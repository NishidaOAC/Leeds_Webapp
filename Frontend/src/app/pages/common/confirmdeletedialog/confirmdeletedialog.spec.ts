import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmdeletedialog } from './confirmdeletedialog';

describe('Confirmdeletedialog', () => {
  let component: Confirmdeletedialog;
  let fixture: ComponentFixture<Confirmdeletedialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmdeletedialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Confirmdeletedialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
