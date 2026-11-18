import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // 👈 Added MatDialogRef
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  imports: [
    MatFormFieldModule, 
    MatCardModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatDialogModule, 
    MatButtonModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  // 👈 Inject MatDialogRef for this component instance
  private dialogRef = inject(MatDialogRef<ForgotPassword>); 

  forgotForm = this.fb.group({
    empNo: ['', [Validators.required]]
  });

  isLoading = false;

  submit(): void {
    if (this.forgotForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.authService.requestPasswordReset(
      this.forgotForm.value.empNo!
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert(res?.message || 'Password reset request has been submitted to your manager for approval.');
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || 'Something went wrong. Please contact HR.');
      }
    });
  }

  close(): void {
    this.dialogRef.close(); // 👈 Now works!
  }
}