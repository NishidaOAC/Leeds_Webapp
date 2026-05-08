import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title style="color: #1a237e;">Review Renewal Reminder</h2>
    <mat-dialog-content>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <p><strong>To:</strong> {{ data.to }}</p>
        <p><strong>Subject:</strong> Official Notice: Certificate Renewal Required - {{ data.supplierName }}</p>
      </div>

      <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #f0f0f0; padding: 20px; background: white;">
        <h3 style="color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 10px; margin-top: 0;">
          Certification Renewal Notice
        </h3>
        <p>Dear <strong>{{ data.supplierName }}</strong>,</p>
        <p>This is a formal notification regarding your quality certification on file with <strong>Aero Assist</strong>, which is scheduled to expire on 
           <span style="color: #d32f2f; font-weight: bold;">{{ data.expiryDate }}</span>.</p>
        <p>{{ data.customMessage }}</p>
        <p>Best Regards,<br><strong>Quality Governance Team</strong><br>Aero Assist</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true">
        <span class="material-icons" style="vertical-align: middle; font-size: 18px;">send</span>
        Send Email Now
      </button>
    </mat-dialog-actions>
  `
})
export class EmailPreviewDialog {
  data = inject(MAT_DIALOG_DATA);
}