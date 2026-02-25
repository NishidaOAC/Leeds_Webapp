/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompanyService } from '../company.service';
import { HttpClient } from '@angular/common/http';
import {MatStepperModule} from '@angular/material/stepper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCardModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule, MatStepperModule
   ],
    providers: [DatePipe],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent {
  dialogRef = inject(MatDialogRef<AddCompanyComponent>, { optional: true })
  dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  companyForm: FormGroup;

  toggleCompanyType(type: 'customer' | 'supplier'): void {
    const control = this.companyForm.get(type);
    if (control) {
      control.setValue(!control.value);
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      code: [''],
      contactPerson: [''],
      designation:[''],
      email:[''],
      website: [''],
      phoneNumber: [''],
      address1: [''],
      address2: [''],
      city: [''],
      country: [''],
      state: [''],
      zipcode: [''],
      linkedIn: [''],
      remarks: [''],
      customer: [false],
      supplier: [false],
    });
  }
  ngOnInit(): void {
    if (this.company) {
      // this.patchCompany(this.company);
    }
    // this.getCompany()
    if(this.dialogData){
      this.companyForm.get('companyName')?.setValue(this.dialogData.name);
      if(this.dialogData.type === 'sup') this.companyForm.get('supplier')?.setValue(true);
      else if(this.dialogData.type === 'cust') this.companyForm.get('customer')?.setValue(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && this.company) {
      // Patch base company data
      this.companyForm.patchValue(this.company);
    } else if (!this.company) {
      this.companyForm.reset();
    }
    // this.getDesignations();
    // this.getCompanies();
  }


  // designations!: any[]
  // private rs = inject(DesignationServices)
  // getDesignations(){
  //   this.rs.getRoles().subscribe(res => {
  //     this.designations = res;
  //   })
  // }

  resetForm(){

  }

  @Input() company: any = null;
  @Output() formSaved = new EventEmitter<void>();
  private companyService = inject(CompanyService);
  private snackBar = inject(MatSnackBar);
  isLoading = false;
  private router = inject(Router);
  onSubmit(): void {
    this.isLoading = true;
    if (this.companyForm.valid) {
      if(this.company){
        this.companyService.updateCompany(this.company.id, this.companyForm.value).subscribe(() => {
          setTimeout(() => {
            if (this.dialogRef) this.dialogRef.close();
            else  this.router.navigateByUrl('/login/company');
            this.isLoading = false;
            this.companyForm.reset();
            this.formSaved.emit();
            this.snackBar.open('Company updated succesfully', 'Close', { duration: 3000 });
          }, 2000);
        });
      }else{
        this.companyService.addCompany(this.companyForm.value).subscribe({
          next: (res) => {
            setTimeout(() => {
            if (this.dialogRef) this.dialogRef.close();
            else  this.router.navigateByUrl('/login/company');
              
              this.isLoading = false;
              this.companyForm.reset();
              this.formSaved.emit();
              this.snackBar.open('Company added succesfully', 'Close', { duration: 3000 });
              
            }, 2000);
          },error: (err) => {
            this.isLoading = false;
          }
        });
      }
    }
  }
}