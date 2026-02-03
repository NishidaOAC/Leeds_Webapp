import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPassword } from './forgot-password/forgot-password';
@Component({
  selector: 'app-side-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatCheckboxModule, MatInputModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss']
})
export class AppSideLoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      empNo: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    this.loadRememberedUser();
  }

  loadRememberedUser(): void {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberMe && rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true
      });
    }
  }
  


  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const rememberMe = this.loginForm.get('rememberMe')?.value;
    const empNo = this.loginForm.get('empNo')?.value;
    const password = this.loginForm.get('password')?.value;
    if (rememberMe) {
      localStorage.setItem('rememberedEmpNo', empNo);
      localStorage.setItem('rememberedPassword', password);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmpNo');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
    }
    const loginData = {
      empNo: empNo,
      password: password
    }
    this.auth.login(loginData).subscribe({
      next: (res: any) => {
        this.auth.storeAuthData(res.data);
        this.router.navigateByUrl('/dashboard'); // ✅ correct route
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }

  private dialog = inject(MatDialog);
  openForgotPasswordDialog(): void {
    this.dialog.open(ForgotPassword, {
      width: '400px',
      disableClose: true,
      autoFocus: true
    });
  }

}
