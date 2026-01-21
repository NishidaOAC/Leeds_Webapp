import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VerificationDialogueComponent } from '../verification-dialogue/verification-dialogue.component';
import { MatButtonModule } from '@angular/material/button';
import { SafePipe } from '../../../../../assets/pipes/safe.pipe';
import { InvoiceService } from '../../invoice.service';
import { AuthService } from '../../../authentication/auth.service';
import { DesignationServices } from '../../../users/role-list.component/designation.service';
import { PerformaInvoiceStatus } from '../../performa-invoice-status';
import { MatInputModule } from '@angular/material/input';
import { BankReceiptDialogueComponent } from '../bank-receipt-dialogue/bank-receipt-dialogue.component';

@Component({
  selector: 'app-view-invoices',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatProgressSpinnerModule, MatInputModule,
    RouterModule, MatTabGroup, MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    SafePipe,
    MatProgressSpinnerModule, MatFormFieldModule, ReactiveFormsModule,UpperCasePipe,DatePipe
  ],
  templateUrl: './view-invoices.component.html',
  styleUrl: './view-invoices.component.scss'
})
export class ViewInvoicesComponent {
  ngOnDestroy(): void {
    this.roleSub?.unsubscribe();
    this.piSub?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.dialogSub?.unsubscribe();
    this.verifiedSub?.unsubscribe();
  }
  invoiceService=inject(InvoiceService)
  loginService=inject(AuthService)
  snackBar=inject(MatSnackBar)
  router=inject(Router)
  route=inject(ActivatedRoute)
  dialog=inject(MatDialog)
  userId!: number

  formatNotes(notes: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to match URLs
    return notes.replace(urlRegex, (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  }

  formatRemarks(remarks: string | null | undefined): string {
    if (!remarks) return ''; // Handle null or undefined values gracefully

    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to match URLs
    return remarks.replace(urlRegex, (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    const token: any = localStorage.getItem('user')
    const user = JSON.parse(token)
    this.userId = user.id;

    const roleId = user.roleId
    this.getRoleById(roleId, id)
  }

  roleSub!: Subscription;
  roleName!: string;
  sp: boolean = false;
  kam: boolean = false;
  am: boolean = false;
  ma: boolean = false;
  admin: boolean = false;
  teamLead: boolean = false;
  private designationService = inject(DesignationServices);
  getRoleById(id: number, piId: number){
    this.roleSub = this.designationService.getRoleById(id).subscribe(role => {
      this.roleName = role.roleName;
      this.getPiById(piId)

      if(this.roleName === 'Sales Executive') this.sp = true;
      if(this.roleName === 'Key Account Manager') this.kam = true;
      if(this.roleName === 'Manager') this.am = true;
      if(this.roleName === 'Accountant') this.ma = true;
      if(this.roleName === 'Administrator') { this.admin = true }
      if(this.roleName === 'Team Lead') { this.teamLead = true }
    })
  }

  encodeUrl(url: string): string {
    return encodeURIComponent(url);
  }

  statusDataSource = new MatTableDataSource<any>([]);
  // Add this method to your component
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'APPROVED': 'status-approved',
      'KAM APPROVED': 'status-approved',
      'AM APPROVED': 'status-approved',
      'BANK SLIP ISSUED': 'status-bank-slip',
      'CARD PAYMENT SUCCESS': 'status-payment-success',
      'PENDING': 'status-pending',
      'GENERATED': 'status-pending',
      'REJECTED': 'status-rejected',
      'KAM REJECTED': 'status-rejected',
      'AM REJECTED': 'status-rejected'
    };
    
    // Convert to uppercase for matching
    const upperStatus = (status || '').toUpperCase();
    return statusMap[upperStatus] || 'status-pending';
  }

  piSub!: Subscription;
  url!: string;
  piNo!: string;
  pi!: any;
  bankSlip!: string;
  signedUrl!: any[];
  getPiById(id: number){
    this.piSub = this.invoiceService.getPIById(id).subscribe(pi => {
      this.pi = pi;
      this.piNo = pi.piNo;

      const signedUrlsWithType = pi.url.map((signedUrl: any) => {
        const url = signedUrl.url;
        const fileType = url.split('.').pop().split('?')[0];
        return {
            url: url,
            type: fileType,
            remarks: signedUrl.remarks
        };
      });

      this.signedUrl = signedUrlsWithType;
      
      if( (this.pi.status === 'GENERATED' || this.pi.status === 'KAM VERFIED' || this.pi.status === 'KAM REJECTED' ) && this.roleName === 'Key Account Manager' ){
        this.pi = {
          ...this.pi,
          approveButtonStatus: true
        };
      }else if( (this.pi.status === 'INITIATED' || this.pi.status === 'KAM VERIFIED' )&& this.roleName === 'Manager' ){
        this.pi = {
          ...this.pi,
          approveButtonStatus: true
        };
      }
      if(pi.bankSlip != null) this.bankSlip = pi.bankSlip;

      this.getPiStatusByPiId(id)
    });
  }
  filterValue!: string
  statusSub!: Subscription;
  status: PerformaInvoiceStatus[] = [];
  getPiStatusByPiId(id: number){
    this.statusSub = this.invoiceService.getPIStatusByPIId(id, this.filterValue).subscribe(status => {
      this.status = status;
    });
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim()
    this.getPiById(this.route.snapshot.params['id'])
  }

  dialogSub!: Subscription;
  submittingForm: boolean = false;
  verifiedSub!: Subscription;
  submitted: boolean = false;
  verified(value: string, piNo: string, sp: string, id: number, stat: string){
    let status = this.pi.status;
    this.submittingForm = true;
    if(stat === 'INITIATED' && value === 'approved') status = 'AM APPROVED';
    else if(stat === 'INITIATED' && value === 'rejected') status = 'AM REJECTED';
    if(status === 'GENERATED' && value === 'approved') status = 'KAM VERIFIED';
    else if(status === 'GENERATED' && value === 'rejected') status = 'KAM REJECTED';
    else if(status === 'KAM VERIFIED' && value === 'approved') status = 'AM VERIFIED';
    else if(status === 'KAM VERIFIED' && value === 'rejected') status = 'AM REJECTED';

    const dialogRef = this.dialog.open(VerificationDialogueComponent, {
      data: { invoiceNo: piNo, status: status, sp: sp }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      this.submitted = true;
      if(result){
        this.submittingForm = true;
        let data = {
          status: status,
          performaInvoiceId: id,
          remarks: result.remarks,
          kamId: result.kamId,
          amId: result.amId,
          accountantId: result.accountantId
        }

        this.verifiedSub = this.invoiceService.updatePIStatus(data).subscribe(result => {
          this.submittingForm = false;
          this.submitted = false;
          this.getPiById(id)
          this.snackBar.open(`Invoice ${piNo} updated to ${status}...`,"" ,{duration:3000})
          this.router.navigateByUrl('login/viewApproval/view')
        });
      }
    })
  }

  addBankSlip(piNo: string, id: number, status: string){
    const dialogRef = this.dialog.open(BankReceiptDialogueComponent, {
      data: { invoiceNo: piNo, id: id, status: status }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getPiById(id)
        this.snackBar.open(`BankSlip is attached with Invoice ${piNo} ...`,"" ,{duration:3000})
      }
    })
  }

  goBack() {
    // Get the returnPage from current route query params
    const returnPage = this.route.snapshot.queryParams['returnPage'] || 1;
    // Navigate back to list with pagination preserved
    this.router.navigate(['dashboard/payments'], { 
      queryParams: { page: returnPage } 
    });
  }


}

