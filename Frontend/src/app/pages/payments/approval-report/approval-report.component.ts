import { Component, Inject, inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule, MatDateRangeInput } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { InvoiceService } from '../invoice.service';
import { UsersServices } from '../../users/users.service';
import { AuthService } from '../../authentication/auth.service';
import { PerformaInvoice } from '../performa-invoice';
import { SafePipe } from '../../../../assets/pipes/safe.pipe';
import { User } from '../../users/users-list/user.model';
import { TeamService } from '../../users/team-list/team.service';


@Component({
  selector: 'app-approval-report',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatDatepickerModule, ReactiveFormsModule,  MatFormFieldModule, MatCardModule, MatToolbarModule,
    MatIconModule, MatButtonModule, MatSelectModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, SafePipe,
    MatPaginatorModule, MatDividerModule, MatChipsModule, MatDateRangeInput],
  templateUrl: './approval-report.component.html',
  styleUrl: './approval-report.component.scss',
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }, DatePipe
  ],
})
export class ApprovalReportComponent {
  _snackbar = inject(MatSnackBar)
  invoiceService = inject(InvoiceService)
  userService= inject(UsersServices)
  loginService = inject(AuthService)
  dialog = inject(MatDialog)
  router = inject(Router)
  snackBar = inject(MatSnackBar)
  route = inject(ActivatedRoute)

  @Input() status: string = '';

  selectedTab: string = '';
  header: string = 'Invoices';
dataSource: any;
  onTabClick(tabName: string) {
    this.selectedTab = tabName;
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
    this.invoiceSub?.unsubscribe();
  }

  user!: number;
  isSubmitted: boolean = false;
  ngOnInit() {
    this.getUsers()
    this.getTeam()
    this.getByFilter()
  }

  private teamService = inject(TeamService);
  teams: any[] = [];
  getTeam(){
    this.teamService.getTeams().subscribe(res=>{
      this.teams = res;
    })
  }
  teamId!: number;
  invoices: PerformaInvoice[] = [];
  invoiceSub!: Subscription;
  totalItems = 0;
  getByFilter(){
    this.isLoading = true;
    const data = {
      teamId: this.teamId ? this.teamId : null,
      invoices: this.invoices,
      invoiceNo: this.filterValue ? this.filterValue : '',
      addedBy: this.addedBy ? this.addedBy : null,
      status: this.status ? this.status : null,
      startDate: this.startDate ? this.datePipe.transform(this.startDate, 'yyyy-MM-dd') : null,
      endDate: this.endDate ? this.datePipe.transform(this.endDate, 'yyyy-MM-dd') : null
    };

    this.invoiceSub = this.invoiceService.getAdminReports(data).subscribe(res=>{
      this.invoices = res;
      this.isLoading = false;
      this.totalItems = res.length;
    })
  }

  getStatus(event: MatSelectChange) {
    this.status = event.value;
    this.getByFilter()
  }

  getTeamWise(event: MatSelectChange) {
    this.teamId = event.value;
    console.log(this.teamId);
    
    this.getByFilter()
  }

  filterValue: string = '';
  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim()

    this.getByFilter()
  }

  startDate: any;
  endDate: any;
  onDateChange(type: 'start' | 'end', event: MatDatepickerInputEvent<Date>): void {
    if (type === 'start') {
      this.startDate = event.value;
    } else if (type === 'end') {
      this.endDate = event.value;
    }

    if (this.startDate && this.endDate) {
      this.getByFilter();
    }
  }


  addedBy!: number
  getAdded(id: number){
    this.addedBy = id;

    this.getByFilter()
  }

  filteredUsers: User[] = [];
  usersSub!: Subscription;
  Users: User[] = [];
  getUsers() {
    this.usersSub = this.userService.getAllUsers().subscribe(res => {
      this.Users = res;
    });
  }

  private datePipe = inject(DatePipe);
  makeExcel() {
    const data = {
      invoices: this.invoices,
      invoiceNo: this.filterValue? this.filterValue : '',
      addedBy: this.addedBy? this.addedBy : null,
      status: this.status? this.status : null,
      startDate: this.startDate? this.datePipe.transform(this.startDate, 'yyyy-MM-dd') : null,
      endDate: this.endDate? this.datePipe.transform(this.endDate, 'yyyy-MM-dd') : null
    }

    this.invoiceService.reportExport(data).subscribe((res:any)=>{
      if (res.message === 'File uploaded successfully') {
        this.router.navigate(['login/viewApproval/approvalReport/excellog/openexcel'], { queryParams: { name: res.name } });
        this.snackBar.open('Excel File exported successfully...', '', { duration: 3000 });
      }
    })
  }

  isLoading: boolean = false;
  // Status methods for styling
getStatusClass(status: string): string {
  const statusMap: {[key: string]: string} = {
    'GENERATED': 'status-generated',
    'KAM VERIFIED': 'status-kam-verified',
    'KAM REJECTED': 'status-kam-rejected',
    'AM VERIFIED': 'status-am-verified',
    'AM REJECTED': 'status-am-rejected',
    'BANK SLIP ISSUED': 'status-bank-slip-issued',
    'CARD PAYMENT SUCCESS': 'status-payment-success'
  };
  
  const normalizedStatus = status?.split('_')[0] || '';
  return statusMap[normalizedStatus] || 'status-generated';
}

getStatusIcon(status: string): string {
  const iconMap: {[key: string]: string} = {
    'GENERATED': 'hourglass_empty',
    'KAM VERIFIED': 'check_circle',
    'KAM REJECTED': 'cancel',
    'AM VERIFIED': 'check_circle',
    'AM REJECTED': 'cancel',
    'BANK SLIP ISSUED': 'receipt',
    'CARD PAYMENT SUCCESS': 'credit_card'
  };
  
  const normalizedStatus = status?.split('_')[0] || '';
  return iconMap[normalizedStatus] || 'hourglass_empty';
}

getStatusDisplay(status: string): string {
  // Remove the _count part for display
  return status?.split('_')[0] || status;
}

// Define displayed columns for mat-table
displayedColumns: string[] = ['invoiceNo', 'salesExecutive', 'kam', 'manager', 'accountant', 'status'];
}


