/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, inject, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafePipe } from '../../../../../assets/pipes/safe.pipe';
import { environment } from '../../../../../environments/environment';
import { AddCompanyComponent } from '../../../company/add-company/add-company.component';
import { CompanyService } from '../../../company/company.service';
import { User } from '../../../users/users-list/user.model';
import { Company } from '../../company';
import { InvoiceService } from '../../invoice.service';
import { UsersServices } from '../../../users/users.service';
import { DesignationServices } from '../../../users/role-list.component/designation.service';
import { FileService } from '../../file-service';

@Component({
  selector: 'app-update-pi',
  standalone: true,
  imports: [ ReactiveFormsModule, MatFormFieldModule,  MatCardModule,  MatToolbarModule,  MatButtonModule, MatIconModule,
    MatSelectModule, MatInputModule, SafePipe, CommonModule, MatAutocompleteModule, MatProgressSpinnerModule],
  templateUrl: './update-pi.component.html',
  styleUrl: './update-pi.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UpdatePIComponent {
  url = environment.apiUrl;

  invoiceService =inject(InvoiceService)
  loginService = inject(UsersServices)
  fb=inject(FormBuilder)
  snackBar=inject(MatSnackBar)
  router= inject(Router)
  route= inject(ActivatedRoute)

  sanitizer=inject(DomSanitizer)
  companyService=inject(CompanyService)

  ngOnDestroy(): void {
    this.uploadSub?.unsubscribe();
    this.upload?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.piSub?.unsubscribe();
    this.kamSub?.unsubscribe();
    this.amSub?.unsubscribe();
    this.accountantSub?.unsubscribe();
    this.companySub?.unsubscribe();
    this.customerSub?.unsubscribe();
    this.deleteUploadSub?.unsubscribe();
    this.roleSub?.unsubscribe();
  }

  piForm = this.fb.group({
    piNo: ['', Validators.required],
    url: this.fb.array([]),
    remarks: [''],
    status: [''],
    kamId: <any>[],
    amId:  <any>[],
    accountantId:  <any>[],
    supplierId: <any>[],
    supplierName: [''],
    supplierPoNo: ['', Validators.required],
    supplierSoNo:[''],
    supplierCurrency:['Dollar'],
    supplierPrice: [Validators.required],
    purpose: [[], Validators.required],
    customerId: <any>[],
    customerName: [''],
    customerPoNo: [''],
    customerSoNo:[''],
    customerCurrency:['Dollar'],
    poValue: [],
    notes:[''],
    paymentMode: ['WireTransfer']
  });

  get isCustomerSelected(): boolean {
    const purposeValue: any = this.piForm.get('purpose')?.value;
    return Array.isArray(purposeValue) && purposeValue.includes('Customer');
  }

  public supplierCompanies!: Company[];
  public customerCompanies!: Company[];
  companySub!: Subscription;
  public getSuppliers(): void {
    this.companySub = this.companyService.getSuppliers().subscribe((suppliers: any) =>{
      this.supplierCompanies = suppliers;
      this.fileterdOptions = this.supplierCompanies;
    });
  }

  customerSub!: Subscription;
  public getCustomers(): void {
    this.customerSub = this.companyService.getCustomers().subscribe((customers: any) =>{
      this.customerCompanies = customers;
      this.filteredCustomers = this.customerCompanies;
    });
  }

  filterValue!: string;
  filteredCustomers: Company[] = [];
  fileterdOptions: Company[] = [];
  search(event: Event, type: string) {
    if(type === 'sup'){
      this.filterValue = (event.target as HTMLInputElement).value.trim().replace(/\s+/g, '').toLowerCase();
      this.fileterdOptions = this.supplierCompanies.filter(option =>
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

  patch(selectedSuggestion: Company, type: string) {
    if(type === 'sup') this.piForm.patchValue({ supplierId: selectedSuggestion.id, supplierName: selectedSuggestion.companyName });
    else if(type === 'cust')  this.piForm.patchValue({ customerId: selectedSuggestion.id, customerName: selectedSuggestion.companyName});
  }

  private dialog = inject(MatDialog);
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
        this.newImageUrl.splice(index, 1);
    } else {
        alert(`Index ${index} is out of bounds for removal`);
    }
  }

  id!: number;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.patchdata(this.id);
    }
    this.getKAM();
    this.getAM();
    this.getAccountants();

    const token: any = localStorage.getItem('user')
    const user = JSON.parse(token)
    this.roleName = user.power;
    // const roleId = user.roleId
    this.getRoleById()
    this.getSuppliers();
    this.getCustomers()
  }

  kamSub!: Subscription;
  kam: User[] = [];
  getKAM(){
    this.kamSub = this.loginService.getUserByRoleName('Key Account Manager').subscribe(user =>{
      this.kam = user;
    });
  }

  fileType: any[] = [];
  uploadSub!: Subscription;
  imageUrl: any[] = [];
  newImageUrl: any[] = [];
  allowedFileTypes = ['pdf', 'jpeg', 'jpg', 'png', 'plain'];
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

    const inv = this.piNo ; 
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
              this.newImageUrl[i] = fileUrl;
              this.preloadImage(fileUrl, i);
            }
          } else {
            console.error('No fileUrl in response:', response);
            alert('Upload succeeded but no file URL returned');
          }
        } else {
          console.error('Upload not successful:', response);
          alert(response?.message || 'Upload failed');
        }
      },
      error: (error) => {
        console.error('Upload error:', error);
        if (error.status === 413) {
          alert('File is too large. Please select a smaller file.');
        } else {
          alert(`File upload failed: ${error.error?.message || error.message}`);
        }
      },
      complete: () => {
        console.log('Upload completed');
      }
    });
  }

    // Helper method to preload and verify image
  preloadImage(url: string, index: number): void {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image ${index} loaded successfully`);
      // You could trigger UI update here if needed
    };
    img.onerror = (error) => {
      console.error(`❌ Image ${index} failed to load:`, error);
    };
    img.src = url;
  }

  extractLetters(input: string): string {
    const extractedChars = input.match(/[A-Za-z-]/g);
    const result = extractedChars ? extractedChars.join('') : '';
    return result;
  }

  roleName!: string;
  roleSub!: Subscription;
  sp: boolean = false;
  kamb: boolean = false;
  am: boolean = false;
  ma: boolean = false;
  admin: boolean =false;
  private roleService = inject(DesignationServices);
  getRoleById(){
    // this.roleSub = this.roleService.getRoleById(id).subscribe(role => {
    //   this.roleName = role.roleName;
      if(this.roleName === 'SalesExecutive') this.sp = true;
      if(this.roleName === 'KAM') this.kamb = true;
      if(this.roleName === 'Manager') this.am = true;
      if(this.roleName === 'Accountant') this.ma = true;
      if(this.roleName === 'Admin'||this.roleName === 'Super Administrator') this.admin = true;

    // })
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


  upload!: Subscription;
  submitted: boolean = false;
  onUpdate() {
      let updateMethod;
      this.submitted = true;
      if (this.roleName === 'SalesExecutive') {
        updateMethod = this.invoiceService.updatePIBySE(this.piForm.getRawValue(), this.id);
      } else if (this.roleName === 'KAM') {
        updateMethod = this.invoiceService.updatePIByKAM(this.piForm.getRawValue(), this.id);
      } else if (this.roleName === 'Manager') {
        updateMethod = this.invoiceService.updatePIByAM(this.piForm.getRawValue(), this.id);
      } else if (this.roleName === 'Admin' || this.roleName === 'Super Administrator') {
        updateMethod = this.invoiceService.updatePIByAdminSuperAdmin(this.piForm.getRawValue(), this.id);
      }

      if (updateMethod) {
          if (this.upload) {
              this.upload.unsubscribe();
          }

          this.upload = updateMethod.subscribe({
              next: (invoice: any) => {
                  const piNo = invoice?.piNo;
                  if (piNo) {
                      this.snackBar.open(`Proforma Invoice ${piNo} Updated successfully...`, "", { duration: 3000 });
                      this.submitted = false;
                      this.router.navigateByUrl('/dashboard/payments');
                  } else {
                      this.snackBar.open('Failed to update the invoice. Please try again.', "", { duration: 3000 });
                      this.submitted = false;
                  }
              },
              error: (err) => {
                  const errorMessage = err?.error?.message || 'An error occurred while updating the invoice. Please try again.';
                  this.submitted = false;
                  this.snackBar.open(`Error: ${errorMessage}`, "", { duration: 3000 });
              }
          });
      }
  }


  piSub!: Subscription;
  editStatus: boolean = false;
  fileName!: string;
  piNo!: string;
  patchdata(id: number) {
    this.editStatus = true;
    this.piSub = this.invoiceService.getPIById(id).subscribe(pi => {
      const inv = pi;
      let purposeArray = inv.purpose;
      if (typeof inv.purpose === 'string') {
        purposeArray = inv.purpose.split(',').map((p: any) => p.trim());
      }

      this.piNo = inv.piNo
      const remarks = inv.PerformaInvoiceStatuses.find((s:any) => s.status === inv.status)?.remarks;
      this.piForm.patchValue({
        piNo: inv.piNo,
        status: inv.status,
        remarks: remarks,
        kamId: inv.kamId,
        amId: inv.amId,
        accountantId: inv.accountantId,
        supplierId: inv.supplierId,
        supplierName: inv.suppliers?.companyName,
        supplierSoNo: inv.supplierSoNo,
        supplierPoNo: inv.supplierPoNo,
        supplierPrice: inv.supplierPrice,
        purpose: purposeArray,
        customerId: inv.customerId,
        customerName: inv.customers?.companyName,
        customerPoNo: inv.customerPoNo,
        customerSoNo: inv.customerSoNo,
        poValue: inv.poValue,
        notes: inv.notes,
        paymentMode: inv.paymentMode
      });

      for (let index = 0; index < pi.url.length; index++) {
        this.addDoc(pi.url[index])
      }
      if (inv.url) {
        this.imageUrl = pi.url;
      }
    });
  }

  deleteSub!: Subscription;
  onDeleteUploadedImage(url: string, i: number){
    this.deleteSub = this.fileService.deleteUploadByurl(url).subscribe(()=>{
      this.newImageUrl[i] = '';
      this.imageUrl[i] = '';
      this.snackBar.open("Document is deleted successfully...","" ,{duration:3000})
      this.isImageUploaded()
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: DragEvent, i: number): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const inputEvent = { target: { files: [file] } } as any;
      this.onFileSelected(inputEvent, i);
    }
  }
  imageUploaded!: boolean
  isImageUploaded(): boolean {
    const controls = this.piForm.get('url')as FormArray;
    if( controls.length === 0) { return true}
    const i = controls.length - 1;
    if (this.imageUrl[i] || this.newImageUrl[i]) {
      return true;
    }else return false;
  }

  onPaymentModeChange() {
    this.piForm.get('kamId')?.setValue("")
    this.piForm.get('amId')?.setValue("")
    this.piForm.get('accountantId')?.setValue("")
  }

  currencies = ['Dollar', 'Dirham']
  goBack(){
    this.router.navigateByUrl('/dashboard/payments')
  }
}
