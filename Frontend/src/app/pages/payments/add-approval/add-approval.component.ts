/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { environment } from '../../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../../company/company.service';
import { User } from '../../users/users-list/user.model';
import { Company } from '../company';
import { InvoiceService } from '../invoice.service';
import { PerformaInvoice } from '../performa-invoice';
import { SafePipe } from "../../../../assets/pipes/safe.pipe";
import { UsersServices } from '../../users/users.service';
import { FileService } from '../file-service';
import { DesignationServices } from '../../users/role-list.component/designation.service';
import { AddCompanyComponent } from '../../company/add-company/add-company.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-add-approval',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatCardModule, MatToolbarModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatInputModule, CommonModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, SafePipe],
  templateUrl: './add-approval.component.html',
  styleUrl: './add-approval.component.scss'
})
export class AddApprovalComponent {
  url = environment.apiUrl;
  companyService =inject(CompanyService)
  invoiceService=inject(InvoiceService)
  loginService=inject(UsersServices)
  snackBar=inject(MatSnackBar)
  router=inject(Router)
  route=inject(ActivatedRoute)
  dialog=inject(MatDialog)
  sanitizer=inject(DomSanitizer)
  fb=inject(FormBuilder)

  supplierSub?: Subscription;

  ngOnDestroy(): void {
    this.invSub?.unsubscribe();
    this.uploadSub?.unsubscribe();
    this.submit?.unsubscribe();
    this.supplierSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getSuppliers();
    this.getCustomers()
    this.generateInvoiceNumber()
    this.getKAM();
    this.getAM();
    this.getAccountants();
    const token: any = localStorage.getItem('user');
    const user = JSON.parse(token)
    this.roleName = user.power;
    
    this.getRoleById()
    this.addDoc();

    this.piForm.get('supplierName')?.setValidators([Validators.required, this.supplierValidator()]);
    this.supplierSub = this.piForm.get('supplierName')?.valueChanges.subscribe((val) => {
      const name = typeof val === 'string' ? (val as string).trim() : ((val as any)?.companyName?.trim() || '');
      if (!name) {
        this.piForm.get('supplierProfileId')?.setValue('', { emitEvent: false });
        return;
      }
      const matched = this.supplierCompanies?.find(
        (s) => s.companyName && s.companyName.trim().toLowerCase() === name.toLowerCase()
      );
      if (matched) {
        this.piForm.get('supplierProfileId')?.setValue((matched as any).supplierProfileId || (matched as any).id, { emitEvent: false });
      } else {
        this.piForm.get('supplierProfileId')?.setValue('', { emitEvent: false });
      }
    });
  }
  
  supplierValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value;
      if (!raw) {
        return { required: true };
      }
      const name = typeof raw === 'string' ? (raw as string).trim() : ((raw as any)?.companyName?.trim() || '');
      if (!name) {
        return { required: true };
      }
      if (!this.supplierCompanies || this.supplierCompanies.length === 0) {
        return null;
      }
      const matched = this.supplierCompanies.find(
        (s) => s.companyName && s.companyName.trim().toLowerCase() === name.toLowerCase()
      );
      if (!matched) {
        return { invalidSupplier: true };
      }
      return null;
    };
  }

  onSupplierBlur(): void {
    this.piForm.get('supplierName')?.markAsTouched();
  }

  get isCustomerSelected(): boolean {
    const purposeValue: any = this.piForm.get('purpose')?.value;
    return Array.isArray(purposeValue) && purposeValue.includes('Customer');
  }

  id!: number;
  supplierCompanies: Company[] = [];
  public customerCompanies: Company[] = [];
  public filteredOptions: Company[] = [];
  public getSuppliers(): void {
    this.companyService.getqualifiedSuppliers().subscribe((res: any) => {
    console.log(res);
      
     this.supplierCompanies = res.data || [];
    this.filteredOptions = this.supplierCompanies;

    });
    // this.companyService.getSuppliers().subscribe((suppliers: Company[]) => {
    //   this.supplierCompanies = suppliers;
    //   this.filteredOptions = this.supplierCompanies
    // });
  }

displayFn(item: any): string {
  if (!item) return '';
  return typeof item === 'string' ? item : (item.companyName || '');
}


  filterValue!: string;
  filteredCustomers: Company[] = [];
  searchold(event: Event, type: string) {
    if(type === 'sup'){
      this.filterValue = (event.target as HTMLInputElement).value.trim().replace(/\s+/g, '').toLowerCase();
      this.filteredOptions = this.supplierCompanies.filter(option =>
        option.companyName.replace(/\s+/g, '').toLowerCase().includes(this.filterValue)||
        option.code.toString().replace(/\s+/g, '').toLowerCase().includes(this.filterValue)
      );
    }else if(type === 'cust'){
      this.filterValue = (event.target as HTMLInputElement).value.trim().replace(/\s+/g, '').toLowerCase();
      this.filteredCustomers = this.customerCompanies.filter(option =>
        option.companyName.replace(/\s+/g, '').toLowerCase().includes(this.filterValue)||
        option.code.toString().replace(/\s+/g, '').toLowerCase().includes(this.filterValue)
      );
    }
  }

  search(event: Event, type: string) {
  const inputVal = (event.target as HTMLInputElement).value || '';
  this.filterValue = inputVal.trim().replace(/\s+/g, '').toLowerCase();

  if (type === 'sup') {

    this.filteredOptions = this.supplierCompanies.filter(option => {
      const companyName = (option?.companyName || '').replace(/\s+/g, '').toLowerCase();
      const code = (option?.code?.toString() || '').replace(/\s+/g, '').toLowerCase();

      return companyName.includes(this.filterValue) || code.includes(this.filterValue);
    });
  } else if (type === 'cust') {
    this.filteredCustomers = this.customerCompanies.filter(option => {
      const companyName = (option?.companyName || '').replace(/\s+/g, '').toLowerCase();
      const code = (option?.code?.toString() || '').replace(/\s+/g, '').toLowerCase();

      return companyName.includes(this.filterValue) || code.includes(this.filterValue);
    });
  }
}

  patchold(selectedSuggestion: Company, type: string) {
    if(type === 'sup') this.piForm.patchValue({ supplierId: selectedSuggestion.id, supplierName: selectedSuggestion.companyName });
    else if(type === 'cust')  this.piForm.patchValue({ customerId: selectedSuggestion.id, customerName: selectedSuggestion.companyName});
  }

// ✅ FIXED: Pass the string property companyName
patch(selectedSuggestion: any, type: string) {
  if (selectedSuggestion === 'add') return;

  if (type === 'sup') {
    const supplierCompanyId = selectedSuggestion.supplierCompanyId || selectedSuggestion.companyId || (typeof selectedSuggestion.id === 'number' ? selectedSuggestion.id : null);
    const supplierProfileId = selectedSuggestion.supplierProfileId || (typeof selectedSuggestion.id === 'string' ? selectedSuggestion.id : null);
    const supplierName = selectedSuggestion.companyName || selectedSuggestion.name || (typeof selectedSuggestion === 'string' ? selectedSuggestion : '');

    this.piForm.patchValue({
      supplierProfileId: supplierProfileId,
      supplierId: supplierCompanyId,
      supplierName: supplierName
    });
  } else if (type === 'cust') {
    const customerId = (typeof selectedSuggestion.id === 'number') ? selectedSuggestion.id : null;
    const customerName = selectedSuggestion.companyName || selectedSuggestion.name || (typeof selectedSuggestion === 'string' ? selectedSuggestion : '');
    this.piForm.patchValue({
      customerId: customerId,
      customerName: customerName
    });
  }
}
  add(type: string){
    const name = this.filterValue;
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      data: {type : type, name: name}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getSuppliers()
      this.getCustomers()
    })
  }

  public getCustomers(): void {
    this.companyService.getCustomers().subscribe((customers: Company[]) =>{
      this.customerCompanies = customers
      this.filteredCustomers = this.customerCompanies;
    });
  }

  roleSub!: Subscription;
  roleName: string = '';
  sp: boolean = false;
  kamb: boolean = false;
  am: boolean = false;
  ma: boolean = false;
  private designationService = inject(DesignationServices);
  getRoleById(){
    // this.roleSub = this.designationService.getRoleById(id).subscribe(role => {
      // this.roleName = role.abbreviation;
      if(this.roleName === 'SalesExecutive') this.sp = true;
      if(this.roleName === 'KAM') this.kamb = true;
      if(this.roleName === 'Manager') this.am = true;
      if(this.roleName === 'Accountant') this.ma = true;
      if(this.roleName === 'Admin') this.sp = true;
    // })

  }

  kamSub!: Subscription;
  kam: User[] = [];
  getKAM() {
    this.kamSub = this.loginService.getUserByRoleName('KAM')
      .subscribe(users => {
        this.kam = users;
      });
  }
  amSub!: Subscription;
  AMList: User[] = [];
  getAM(){
    this.amSub = this.loginService.getUserByRoleName('Manager').subscribe(user =>{
      this.AMList = user;
    });
  }

  accountantSub!: Subscription;
  AccountantList: User[] = [];
  getAccountants(){
    this.accountantSub = this.loginService.getUserByRoleName('Accountant').subscribe(user =>{
      this.AccountantList = user;
    });
  }

  piForm = this.fb.group({
    piNo: ['', Validators.required],
    url: this.fb.array([]),
    remarks: [''],
    status: [''],
    kamId: <any>[],
    amId:  <any>[],
    accountantId:  <any>[],
    supplierProfileId: ['', Validators.required],
    supplierId: <any>[''],
    supplierName: ['', Validators.required],
    supplierPoNo: ['', Validators.required],
    supplierSoNo:[''],
    supplierCurrency:['Dollar'],
    supplierPrice: [Validators.required],
    purpose: ['', Validators.required],
    customerId: <any>[],
    customerName: [''],
    customerPoNo: [''],
    customerSoNo:[''],
    customerCurrency:['Dollar'],
    poValue: [],
    notes:[''],
    paymentMode: ['WireTransfer']
  });

  doc(): FormArray {
    return this.piForm.get("url") as FormArray;
  }


  index!: number;
  clickedForms: boolean[] = [];
  addDoc(data?:any){
    this.doc().push(this.newDoc(data));
    this.clickedForms.push(false);
    this.cdr.detectChanges();
  }

  newDoc(initialValue?: any): FormGroup {
    return this.fb.group({
      url: [initialValue?initialValue.url : '', Validators.required],
      remarks: [initialValue?initialValue.remarks : ''],
    });
  }

  deleteUploadSub!: Subscription;
  private cdr = inject(ChangeDetectorRef)
  removeData(index: number) {
    if (index >= 0 && index < this.doc().length) {
        this.doc().removeAt(index);
        this.imageUrl.splice(index, 1);
    } 
  }

  imageUploaded!: boolean
  isImageUploaded(): boolean {
    const controls = this.piForm.get('url')as FormArray;
    if( controls.length === 0) {return true}
    const i = controls.length - 1;
    if (this.imageUrl[i]) {
      return true;
    }else return false;
  }

  files: File[] = [];
  uploadProgress: number[] = [];
  uploadSuccess: boolean[] = [];

  uploadSub!: Subscription;
  imageUrl: string[] = [];
  fileType: string[] = [];
  fullViewUrl: string | null = null;
  fullViewTitle: string = '';

  openFullView(url: string, title?: string): void {
    this.fullViewUrl = url;
    this.fullViewTitle = title || 'Document Preview';
  }

  closeFullView(): void {
    this.fullViewUrl = null;
    this.fullViewTitle = '';
  }

  openInNewTab(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  downloadDocument(url: string | null | undefined, title?: string): void {
    if (!url) return;
    this.fileService.downloadDocument(url, title);
  }

  allowedFileTypes = ['pdf', 'jpeg', 'jpg', 'png', 'plain'];
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: DragEvent, i: number): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0], i);
    }
  }

  onFileSelected(event: Event, i: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file, i);
    }
  }

  private fileService = inject(FileService);
  processFile(file: File, i: number): void {
    // Get file extension correctly
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.split('/')[1];
    this.fileType[i] = fileExtension || mimeType;
    
    if (!this.allowedFileTypes.includes(this.fileType[i].toLowerCase())) {
      alert('Invalid file type. Please select a PDF, JPEG, JPG, TXT, or PNG file.');
      return;
    }

    const inv = this.ivNum; 
    const name = `${inv}_${i}_${Date.now()}`; // Add timestamp for uniqueness
    const formData = new FormData();
    
    // Append file
    formData.append('file', file, file.name);
    formData.append('name', name);
    formData.append('uploaderId', 'user-id-here'); // Add required fields
    formData.append('context', 'invoice');

    // Create metadata
    const metadata = {
      invoiceNumber: inv,
      index: i,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size
    };
    
    // Append metadata as JSON string
    formData.append('metadata', JSON.stringify(metadata));
    
    // Unsubscribe from previous upload if exists
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
    
    this.uploadSub = this.fileService.uploadInvoice(formData).subscribe({
      next: (response) => {
        // Check if response has the expected structure
        if (response && response.success && response.data) {
          const fileUrl = response.data.fileUrl || 
                        response.data.data?.fileUrl || 
                        response.data.location;
          
          if (fileUrl) {
            // Set the URL in your form
            if (this.doc().at(i)) {
              this.doc().at(i).get('url')?.setValue(fileUrl);
              this.imageUrl[i] = fileUrl;
              this.preloadImage(fileUrl, i);
            }
          } else {
            alert('Upload succeeded but no file URL returned');
          }
        } else {
          alert(response?.message || 'Upload failed');
        }
      },
      error: (error) => {
        if (error.status === 413) {
          alert('File is too large. Please select a smaller file.');
        } else {
          alert(`File upload failed: ${error.error?.message || error.message}`);
        }
      },
      complete: () => {
      }
    });
  }

  // Helper method to preload and verify image
  preloadImage(url: string, index: number): void {
    const img = new Image();
    img.onload = () => {
    };
    img.onerror = (error) => {
      console.error(`❌ Image ${index} failed to load:`, error);
    };
    img.src = url;
  }
  invSub!: Subscription;
  prefix: string = '';
  ivNum: string = '';
  generateInvoiceNumber() {
    this.invSub = this.invoiceService.getPI().subscribe((res: any) => {
      if (res.items.length > 0) {
        const maxId = res.items.reduce((prevMax: any, inv: any) => {
          const idNumber = parseInt(inv.piNo.replace(/\D/g, ''), 10);
          this.prefix = this.extractLetters(inv.piNo);
          return !isNaN(idNumber) && idNumber > prevMax ? idNumber : prevMax;
        }, 0);

        const nextId = maxId + 1;
        const paddedId = `${this.prefix}${nextId.toString().padStart(3, "0")}`;
        this.ivNum = paddedId;
      } else {
        const nextId = 1;
        const prefix = "E-";
        const paddedId = `${prefix}${nextId.toString().padStart(3, "0")}`;
        this.ivNum = paddedId;
      }

      this.piForm.get('piNo')?.setValue(this.ivNum);
    });
  }

  extractLetters(input: string): string {
    const extractedChars = input.match(/[A-Za-z-]/g);
    const result = extractedChars ? extractedChars.join('') : '';

    return result;
  }

  submit! : Subscription
  submitted: boolean = false;

onSubmit() {
  if (this.piForm.invalid || !this.isImageUploaded()) {
    this.piForm.markAllAsTouched();
    this.snackBar.open('Please select a valid supplier and fill all required fields.', '', { duration: 3000 });
    return;
  }
  this.submitted = true;

  const rawValues = this.piForm.getRawValue();

  const rawSupplier: any = rawValues.supplierName;
  const rawCustomer: any = rawValues.customerName;
  let supplierName = typeof rawSupplier === 'object' && rawSupplier !== null
    ? (rawSupplier.companyName || rawSupplier.name || '')
    : (rawSupplier || '');
  let customerName = typeof rawCustomer === 'object' && rawCustomer !== null
    ? (rawCustomer.companyName || rawCustomer.name || '')
    : (rawCustomer || '');

  let supplierProfileId = rawValues.supplierProfileId || null;
  let supplierId = (typeof rawValues.supplierId === 'number' && rawValues.supplierId > 0) ? rawValues.supplierId : null;

  // If supplierProfileId is missing, check if supplierName matches any known supplier
  if (!supplierProfileId && typeof supplierName === 'string' && supplierName.trim()) {
    const match = this.supplierCompanies.find(s => 
      (s.companyName || (s as any).name || '').trim().toLowerCase() === supplierName.trim().toLowerCase()
    );
    if (match) {
      supplierProfileId = (match as any).supplierProfileId || (typeof match.id === 'string' ? match.id : null);
      if (!supplierId && (match as any).supplierCompanyId) {
        supplierId = (match as any).supplierCompanyId;
      }
    }
  }

  const payload = {
    ...rawValues,
    supplierName,
    customerName,
    supplierProfileId,
    supplierId,
    customerId: (typeof rawValues.customerId === 'number' && rawValues.customerId > 0) ? rawValues.customerId : null,
    kamId: rawValues.kamId || null,
    amId: rawValues.amId || null,
    accountantId: rawValues.accountantId || null,
  };

  // Set default method, then override by role
  let submitMethod = this.invoiceService.addPI(payload);
  if (this.roleName === 'KAM') submitMethod = this.invoiceService.addPIByKAM(payload);
  if (this.roleName === 'Manager') submitMethod = this.invoiceService.addPIByAM(payload);

  this.submit = submitMethod.subscribe({
    next: (invoice: any) => {
      this.submitted = false;
      const piNo = invoice?.pi?.piNo || invoice?.piNo || payload.piNo;
      if (piNo) {
        this.snackBar.open(`Proforma Invoice ${piNo} uploaded successfully...`, "", { duration: 3000 });
        this.router.navigateByUrl('dashboard/payments');
      } else {
        this.snackBar.open('Invoice created successfully.', "", { duration: 3000 });
        this.router.navigateByUrl('dashboard/payments');
      }
    },
    error: (err: any) => {
      this.submitted = false;
      const errorMessage = err?.error?.message || err?.error?.text || 'An error occurred while uploading the invoice.';
      this.snackBar.open(`Error: ${errorMessage}`, "Close", { duration: 5000 });
    }
    });
  }
  

  onSubmitold() {
    this.submitted = true;
    let submitMethod;
    if (this.roleName === 'SalesExecutive') {
        submitMethod = this.invoiceService.addPI(this.piForm.getRawValue());
    } else if (this.roleName === 'KAM') {
        submitMethod = this.invoiceService.addPIByKAM(this.piForm.getRawValue());
    } else if (this.roleName === 'Manager') {
        submitMethod = this.invoiceService.addPIByAM(this.piForm.getRawValue());
    }

    if (submitMethod) {
        this.submit = submitMethod.subscribe({
            next: (invoice: any) => {
                const piNo = invoice?.pi.piNo;
                if (piNo) {
                    this.snackBar.open(`Proforma Invoice ${piNo} uploaded successfully...`, "", { duration: 3000 });
                    this.submitted = false;
                    this.router.navigateByUrl('dashboard/payments');
                } else {
                    this.snackBar.open('Failed to upload the invoice. Please try again.', "", { duration: 3000 });
                }
            },
            error: (err: any) => {
                const errorMessage = err?.error?.text || 'An error occurred while uploading the invoice.';
                this.submitted = false;
                alert(`Error: ${errorMessage}`);
            }
        });
    }
  }

  onDeleteImage(i: number){
    this.fileService.deleteUploadByurl(this.imageUrl[i]).subscribe(()=>{
      this.imageUrl[i] = ''
        this.doc().at(i).get('docUrl')?.setValue('');
      this.snackBar.open("Document is deleted successfully...","" ,{duration:3000})
    });
  }

  get isCreditCardSelected() {
    return this.piForm.get('paymentMode')?.value === 'CreditCard';
  }
  onPaymentModeChange() {
    this.piForm.get('kamId')?.setValue("")
    this.piForm.get('amId')?.setValue("")
    this.piForm.get('accountantId')?.setValue("")
    
  }


}