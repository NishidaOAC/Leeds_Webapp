import { Component } from '@angular/core';
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
      password: ['', Validators.required]
    });
  }

submit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.auth.login(this.loginForm.value).subscribe({
    next: (res: any) => {
      this.auth.storeAuthData(res.data);
      this.router.navigateByUrl('/dashboard'); // ✅ correct route
    },
    error: (err) => {
      console.error('Login failed', err);
    },
  });
}

}
