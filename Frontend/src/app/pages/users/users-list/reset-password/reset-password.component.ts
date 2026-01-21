import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';
import { UsersServices } from '../../users.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatToolbarModule, MatProgressSpinnerModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy{
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.reset?.unsubscribe();
  }
  private dialogRef = inject(MatDialogRef<ResetPasswordComponent>)
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder)
  form = this.fb.group({
    username: [this.data.empNo],
    paswordReset: [this.data.paswordReset],
    password: ['', [Validators.required, Validators.minLength(6), this.passwordComplexityValidator()]],
    confirmPassword: ['', Validators.required]
  })

  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null; // required validator already checks empty

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
        ? null
        : { passwordComplexity: true };
    };
  }
  
  private subscriptions: Subscription = new Subscription();
  ngOnInit() {
    this.subscriptions.add(
      this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
        this.checkPasswords();
      })
    );

    this.subscriptions.add(
      this.form.get('password')?.valueChanges.subscribe(() => {
        this.checkPasswords();
      })
    );
  }

  passwordMismatch: boolean = false;
  checkPasswords() {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    this.passwordMismatch = password !== confirmPassword;
  }

  generateRandomPassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()';
    const allChars = upper + lower + numbers + special;

    let passwordArray = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special[Math.floor(Math.random() * special.length)]
    ];

    // Remaining characters (to make length 10)
    for (let i = passwordArray.length; i < 10; i++) {
      passwordArray.push(
        allChars[Math.floor(Math.random() * allChars.length)]
      );
    }

    // Shuffle to avoid predictable order
    passwordArray = passwordArray.sort(() => Math.random() - 0.5);

    const password = passwordArray.join('');

    this.form.get('password')?.setValue(password);
    this.form.get('confirmPassword')?.setValue(password);
  }
  
  copyEmpNoAndPassword() {
    const empNo = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;

    if (empNo && password) {
      const textToCopy = `Usernamr: ${empNo}\nPassword: ${password}`;
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          this.snackBar.open('Email and password copied to clipboard',"" ,{duration:3000});
        },
        (err) => {
          console.error('Could not copy text: ', err);
        }
      );
    }
  }

  private readonly userService = inject(UsersServices)
  snackBar = inject(MatSnackBar)
  reset!: Subscription;
  isLoading: boolean = false
  onSubmit(){
    this.isLoading = true;
    this.reset = this.userService.resetPassword(this.data.id, this.form.getRawValue()).subscribe(x => {

      this.dialogRef.close();
      this.isLoading = false;
      this.snackBar.open(`You have successfully reset ${this.data.username}(${this.data.empNo}) password...`,"" ,{duration:3000})
    })
  }

  onCancelClick(){
    this.dialogRef.close();
  }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showConfirmedPassword: boolean = false;

  toggleConfirmedPasswordVisibility() {
    this.showConfirmedPassword = !this.showConfirmedPassword;
  }
}
