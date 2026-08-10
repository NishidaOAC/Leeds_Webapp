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

  submit(): void {
    if (this.forgotForm.invalid) return;

    this.authService.requestPasswordReset(
      this.forgotForm.value.empNo!
    ).subscribe({
      next: () => {
        alert('Password reset request sent to your manager.');
        this.close(); // 👈 Optionally close modal after successful submission
      },
      error: () => {
        alert('Something went wrong. Please contact HR.');
      }
    });
  }

  close(): void {
    this.dialogRef.close(); // 👈 Now works!
  }
}