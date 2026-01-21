import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatCardModule, MatInputModule, MatButtonModule, 
    MatIconModule, MatProgressSpinnerModule, MatCheckboxModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  showSuccessMessage = false;
  successData: any = null;
  
  // Password visibility toggle
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      empNo: [''], // Optional field
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Optional: Add password strength validation
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.validatePasswordStrength(password);
    });
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    if (!this.registerForm.get('acceptTerms')?.value) {
      alert('Please accept the terms and conditions');
      return;
    }

    this.isLoading = true;
    this.showSuccessMessage = false;

    const formData: any = {
      name: this.registerForm.get('name')?.value.trim(),
      email: this.registerForm.get('email')?.value.trim().toLowerCase(),
      password: this.registerForm.get('password')?.value
    };

    // Add empNo only if provided
    const empNo = this.registerForm.get('empNo')?.value.trim();
    if (empNo) {
      formData.empNo = empNo;
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successData = response.data;
          this.showSuccessMessage = true;
          this.registerForm.reset();
          
          // Auto-redirect to login after 5 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Handle specific error cases
        if (error.status === 409) {
          if (error.error?.message?.includes('email')) {
            this.registerForm.get('email')?.setErrors({ duplicate: true });
          } else if (error.error?.message?.includes('Employee number')) {
            this.registerForm.get('empNo')?.setErrors({ duplicate: true });
          }
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private validatePasswordStrength(password: string): void {
    const passwordControl = this.registerForm.get('password');
    if (!password) return;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      passwordControl?.setErrors({ weakPassword: true });
    } else {
      // Clear weak password error if other validations pass
      const errors = passwordControl?.errors;
      if (errors) {
        delete errors['weakPassword'];
        passwordControl?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;

    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'weak';
    if (strength < 70) return 'medium';
    return 'strong';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}