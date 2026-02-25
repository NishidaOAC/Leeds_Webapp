import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersServices } from '../../users.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgForOf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DesignationServices } from '../../role-list.component/designation.service';

@Component({
  selector: 'app-add-user',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatOptionModule, MatProgressSpinnerModule, MatIconModule,
    MatSelectModule, MatOptionModule, MatInputModule, MatCheckboxModule
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
  standalone: true
})
export class AddUser implements OnInit{
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      empNo: ['', Validators.required],
      password: ['', Validators.required],
      roleId: ['', Validators.required],
      personalEmail: ['', Validators.email]
    });
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      // Patch base user data
      this.userForm.patchValue(this.user);
    } else if (!this.user) {
      this.userForm.reset();
    }
    this.getDesignations();
    // this.getCompanies();
  }


  designations!: any[]
  private rs = inject(DesignationServices)
  getDesignations(){
    this.rs.getRoles().subscribe(res => {
      this.designations = res;
    })
  }

  resetForm(){

  }

  @Input() user: any = null;
  @Output() formSaved = new EventEmitter<void>();
  private userService = inject(UsersServices);
  private snackBar = inject(MatSnackBar);
  isLoading = false;
  onSubmit(): void {
    this.isLoading = true;
    if (this.userForm.valid) {
      if(this.user){
        this.userService.updateUser(this.user.id, this.userForm.value).subscribe(() => {
          setTimeout(() => {
            this.isLoading = false;
            this.userForm.reset();
            this.formSaved.emit();
            this.snackBar.open('User updated succesfully', 'Close', { duration: 3000 });
          }, 2000);
        });
      }else{
        this.userService.createUser(this.userForm.value).subscribe({
          next: (res) => {
            setTimeout(() => {
              this.isLoading = false;
              this.userForm.reset();
              this.formSaved.emit();
              this.snackBar.open('User added succesfully', 'Close', { duration: 3000 });
            }, 2000);
          },error: (err) => {
            this.isLoading = false;
          }
        });
      }
    }
  }
}