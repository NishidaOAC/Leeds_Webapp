import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DesignationServices } from '../designation.service';

@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, ReactiveFormsModule, MatOptionModule, MatButtonModule, MatInputModule, MatSelectModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule, MatChipsModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss',
})
export class RoleForm {
  roleForm: FormGroup;
  isEdit = false;
  isLoading = false;
  roleId: number | null = null;
  @Input() role: any = null;
  @Output() formSaved = new EventEmitter<void>();
  accessOptions = ['read', 'write', 'delete', 'manage_users', 'manage_roles', 'view_reports'];
  powers = ['Admin', 'SalesExecutive', 'KAM', 'Manager', 'Accountant'];
  
  get selectedAccessCount(): number {
    return this.roleForm.get('access')?.value?.length || 0;
  }

  constructor(
    private fb: FormBuilder,
    private roleService: DesignationServices,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roleForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && this.role) {
      this.isEdit = true;
      this.roleId = this.role.id;
      this.roleForm.patchValue(this.role);
    } else if (!this.role) {
      this.isEdit = false;
      this.roleForm.reset();
    }
  }

  ngOnInit(): void {
    
  }

  createForm(): FormGroup {
    return this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(2)]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10)]],
      power: ['', [Validators.required]]
    });
  }

  isAccessSelected(access: string): boolean {
    const currentAccess: string[] = this.roleForm.get('access')?.value || [];
    return currentAccess.includes(access);
  }

  toggleAccess(access: string): void {
    const accessControl = this.roleForm.get('access');
    if (accessControl) {
      const currentAccess: string[] = accessControl.value || [];
      const index = currentAccess.indexOf(access);
      
      if (index > -1) {
        currentAccess.splice(index, 1);
      } else {
        currentAccess.push(access);
      }
      
      accessControl.setValue(currentAccess);
      accessControl.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      this.isLoading = true;
      const roleData = this.roleForm.value;
      
      if (this.isEdit && this.roleId) {
        this.roleService.updateRole(this.roleId, roleData).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            this.roleForm.reset();
            this.formSaved.emit();
          },
          error: (error: any) => {
            this.isLoading = false;
          }
        });
      } else {
        this.roleService.createRole(roleData).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            this.roleForm.reset();
            this.formSaved.emit();
          },
          error: (error: any) => {
            this.isLoading = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.roleForm.controls).forEach(key => {
        this.roleForm.get(key)?.markAsTouched();
      });
    }
  }

  onReset(): void {
    // if (this.isEdit && this.roleId) {
    //   this.loadRole(this.roleId);
    // } else {
    //   this.roleForm.reset();
    //   this.roleForm.get('access')?.setValue([]);
    // }
  }
}
