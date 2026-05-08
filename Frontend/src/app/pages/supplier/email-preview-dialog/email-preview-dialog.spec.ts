import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPreviewDialog } from './email-preview-dialog';

describe('EmailPreviewDialog', () => {
  let component: EmailPreviewDialog;
  let fixture: ComponentFixture<EmailPreviewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailPreviewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailPreviewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
