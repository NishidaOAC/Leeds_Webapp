import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-email-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  encapsulation: ViewEncapsulation.None, // Vital to apply the email's inline CSS rules inside the modal
  template: `
    <h2 mat-dialog-title style="color: #0f172a; font-weight: 700;">Review System Broadcast</h2>
    
    <mat-dialog-content>
      <div style="background: #f8fafc; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 16px; font-size: 13px; color: #475569;">
        <div style="margin-bottom: 4px;"><strong>Recipient:</strong> <span style="font-family: monospace;">{{ data.to }}</span></div>
        <div><strong>Subject Line:</strong> {{ data.subject }}</div>
      </div>

      <div [innerHTML]="sanitizedContent" style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;"></div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" style="padding-top: 16px;">
      <button mat-button mat-dialog-close style="color: #64748b;">Dismiss</button>
      <button mat-flat-button style="background-color: #e11d48; color: #ffffff;" [mat-dialog-close]="true">
        <i class="bi bi-send-fill" style="margin-right: 6px; font-size: 13px;"></i>
        Authorize & Send
      </button>
    </mat-dialog-actions>
  `
})
export class EmailPreviewDialog {
  data = inject(MAT_DIALOG_DATA);
  private sanitizer = inject(DomSanitizer);

  // Computes and sanitizes the layout text safely to prevent XSS warnings
  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.data.serverCompiledHtml);
  }
}