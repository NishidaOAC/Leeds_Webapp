import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  imports: [MatFormFieldModule, MatCardModule, ReactiveFormsModule, MatInputModule, MatDialogModule, MatButtonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {

  constructor(
    private authService: AuthService
  ) {}
  
  private fb = inject(FormBuilder);
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
      },
      error: () => {
        alert('Something went wrong. Please contact HR.');
      }
    });
  }

  close(){

  }

}
3