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
import * as ExcelJS from 'exceljs';

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
      invoiceNo: this.filterValue || '',
      addedBy: this.addedBy ? String(this.addedBy) : undefined, // Convert to string or undefined
      status: this.status || undefined,
      startDate: this.startDate ? this.datePipe.transform(this.startDate, 'yyyy-MM-dd') : undefined,
      endDate: this.endDate ? this.datePipe.transform(this.endDate, 'yyyy-MM-dd') : undefined
    };

    // Validate invoices array
    if (!data.invoices || !Array.isArray(data.invoices) || data.invoices.length === 0) {
      alert('No data available to export. Please select invoices to export.');
      return;
    }

    // Call the Excel service - pass only defined values
    const options: any = {};
    if (data.invoiceNo) options.invoiceNo = data.invoiceNo;
    if (data.addedBy) options.addedBy = data.addedBy;
    if (data.status) options.status = data.status;
    if (data.startDate) options.startDate = data.startDate;
    if (data.endDate) options.endDate = data.endDate;

    this.downloadProformaExcel(data.invoices, options).catch(error => {
      console.error('Error downloading Excel:', error);
      alert(`Error downloading Excel: ${error.message || 'Unknown error'}`);
    });
  }

  async downloadProformaExcel(
    data: any[],
    options?: {
      invoiceNo?: string;
      addedBy?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<string> {
    console.log(`Exporting ${data?.length || 0} invoices...`);

    // Validate data
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format. Expected an array of invoices.');
    }

    if (data.length === 0) {
      throw new Error('No data available to export. Please select invoices to export.');
    }

    try {
      const workbook = new ExcelJS.Workbook();
      
      // Add metadata
      workbook.creator = 'AeroAssist FinTech System';
      workbook.created = new Date();
      workbook.lastModifiedBy = 'AeroAssist System';
      workbook.modified = new Date();
      
      const worksheet = workbook.addWorksheet('Proforma Report', {
        views: [{ showGridLines: true }]
      });

      // ========== ADD TITLE AND HEADER ROWS ==========
      this.addTitleRows(worksheet, options);
      
      // ========== DEFINE COLUMNS ==========
      const columns = this.getColumnDefinitions();
      
      // Add column headers
      const headerRow = worksheet.addRow(columns.map(col => col.header));
      this.styleHeaderRow(headerRow);
      
      // ========== ADD DATA ROWS ==========
      this.addDataRows(worksheet, data);
      
      // ========== APPLY COLUMN WIDTHS ==========
      this.applyColumnWidths(worksheet, columns);
      
      // ========== ADD SUMMARY SECTION ==========
      this.addSummarySection(worksheet, data.length);
      
      // ========== FREEZE PANES ==========
      const filterText = this.getFilterText(options);
      const headerStartRow = filterText ? 6 : 5;
      worksheet.views = [
        {
          state: 'frozen',
          xSplit: 0,
          ySplit: headerStartRow,
          activeCell: `A${headerStartRow + 1}`
        }
      ];
      
      // ========== GENERATE AND DOWNLOAD FILE ==========
      const buffer = await workbook.xlsx.writeBuffer();
      return this.saveExcelFile(buffer, data.length);
      
    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw error instanceof Error ? error : new Error('Failed to generate Excel report');
    }
  }

  // ========== HELPER METHODS ==========

  private addTitleRows(worksheet: ExcelJS.Worksheet, options?: any): void {
    // Title row
    const titleRow = worksheet.addRow(['PROFORMA INVOICES REPORT']);
    titleRow.font = { 
      bold: true, 
      size: 16, 
      color: { argb: '1F4E78' } 
    };
    titleRow.alignment = { 
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.mergeCells('A1:V1');
    
    // Subtitle with date range
    let subtitleText = 'All Proforma Invoices';
    if (options?.startDate && options?.endDate) {
      const startDate = new Date(options.startDate).toLocaleDateString();
      const endDate = new Date(options.endDate).toLocaleDateString();
      subtitleText = `Date Range: ${startDate} to ${endDate}`;
    }
    
    const subtitleRow = worksheet.addRow([subtitleText]);
    subtitleRow.font = { 
      italic: true, 
      size: 11,
      color: { argb: '666666' }
    };
    subtitleRow.alignment = { 
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.mergeCells('A2:V2');
    
    // Generated info row
    const generatedRow = worksheet.addRow([
      `Generated on: ${new Date().toLocaleString()} by AeroAssist System`
    ]);
    generatedRow.font = { 
      size: 10,
      color: { argb: '999999' }
    };
    generatedRow.alignment = { 
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.mergeCells('A3:V3');
    
    // Filter info row if filters are applied
    const filterText = this.getFilterText(options);
    if (filterText) {
      const filterRow = worksheet.addRow([`Filters Applied: ${filterText}`]);
      filterRow.font = { 
        italic: true, 
        size: 10,
        color: { argb: '666666' }
      };
      filterRow.alignment = { 
        horizontal: 'center',
        vertical: 'middle'
      };
      worksheet.mergeCells('A4:V4');
    }
    
    // Empty row for spacing
    worksheet.addRow([]);
  }

  private getFilterText(options?: any): string {
    const filters: string[] = [];
    if (options?.invoiceNo) filters.push(`Invoice No: ${options.invoiceNo}`);
    if (options?.status) filters.push(`Status: ${options.status}`);
    if (options?.addedBy) filters.push(`Added By: ${options.addedBy}`);
    return filters.join(' | ');
  }

  private getColumnDefinitions(): Array<{header: string, key: string, width: number}> {
    return [
      { header: 'PI NO', key: 'piNo', width: 12 },
      { header: 'PO NO', key: 'supplierPoNo', width: 12 },
      { header: 'Supplier', key: 'supplier', width: 25 },
      { header: 'Invoice NO', key: 'supplierSoNo', width: 15 },
      { header: 'Amount', key: 'supplierPrice', width: 18 },
      { header: 'Purpose', key: 'purpose', width: 20 },
      { header: 'Customer', key: 'customer', width: 25 },
      { header: 'Customer SoNo', key: 'customerSoNo', width: 15 },
      { header: 'Customer PoNo', key: 'customerPoNo', width: 15 },
      { header: 'Customer Price', key: 'customerPrice', width: 18 },
      { header: 'Payment Mode', key: 'paymentMode', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Added By', key: 'addedBy', width: 20 },
      { header: 'Sales Person', key: 'salesPerson', width: 20 },
      { header: 'KAM', key: 'kamName', width: 20 },
      { header: 'AM', key: 'amName', width: 20 },
      { header: 'Accountant', key: 'accountant', width: 20 },
      { header: 'Created Date', key: 'createdDate', width: 20 },
      { header: 'Updated Date', key: 'updatedDate', width: 20 },
      { header: 'Attachments', key: 'url', width: 40 },
      { header: 'Wire Slip', key: 'bankSlip', width: 30 },
      { header: 'Notes', key: 'notes', width: 40 }
    ];
  }

  private styleHeaderRow(headerRow: ExcelJS.Row): void {
    headerRow.eachCell((cell) => {
      cell.font = { 
        bold: true, 
        color: { argb: 'FFFFFF' },
        size: 11
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2E7D32' }
      };
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin', color: { argb: '1B5E20' } },
        left: { style: 'thin', color: { argb: '1B5E20' } },
        bottom: { style: 'thin', color: { argb: '1B5E20' } },
        right: { style: 'thin', color: { argb: '1B5E20' } }
      };
    });
  }

  private addDataRows(worksheet: ExcelJS.Worksheet, data: any[]): void {
    data.forEach((item, index) => {
      const rowData = this.formatRowData(item);
      const row = worksheet.addRow(rowData);
      
      // Apply row styling
      this.styleDataRow(row, index, item.status);
    });
  }

  private formatRowData(item: any): any[] {
    return [
      item.piNo || 'N/A',
      item.supplierPoNo || 'N/A',
      item.suppliers?.companyName || 'N/A',
      item.supplierSoNo || 'N/A',
      `${item.poValue || 0} ${item.supplierCurrency || ''}`,
      item.purpose || 'N/A',
      item.customers?.companyName || 'N/A',
      item.customerSoNo || 'N/A',
      item.customerPoNo || 'N/A',
      `${item.customerPrice || 0} ${item.customerCurrency || ''}`,
      item.paymentMode || 'N/A',
      item.status || 'N/A',
      item.addedBy?.name || 'N/A',
      item.salesPerson?.name || 'N/A',
      item.kam?.name || 'N/A',
      item.am?.name || 'N/A',
      item.accountant?.name || 'N/A',
      item.createdAt ? this.formatDate(item.createdAt) : 'N/A',
      item.updatedAt ? this.formatDate(item.updatedAt) : 'N/A',
      item.url?.length > 0 ? `${item.url.length} attachment(s)` : 'No attachments',
      item.bankSlip || 'No slip',
      item.notes || 'No notes'
    ];
  }

  private formatDate(dateString: string | Date): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  }

  private styleDataRow(row: ExcelJS.Row, index: number, status?: string): void {
    // Add borders to all cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'DDDDDD' } },
        left: { style: 'thin', color: { argb: 'DDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'DDDDDD' } },
        right: { style: 'thin', color: { argb: 'DDDDDD' } }
      };
      cell.alignment = {
        vertical: 'middle',
        wrapText: true
      };
    });
    
    // Alternate row colors
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F8F9FA' }
      };
    }
    
    // Color code status column (column L)
    this.applyStatusStyle(row.getCell(12), status);
  }

  private applyStatusStyle(cell: ExcelJS.Cell, status?: string): void {
    const statusLower = (status || '').toLowerCase();
    
    const statusColors: {[key: string]: string} = {
      'approved': '2E7D32', // Green
      'completed': '2E7D32', // Green
      'pending': 'FF9800',   // Orange
      'in progress': 'FF9800', // Orange
      'rejected': 'F44336',   // Red
      'cancelled': 'F44336'   // Red
    };
    
    const color = statusColors[statusLower];
    if (color) {
      cell.font = { 
        color: { argb: color }, 
        bold: true 
      };
    }
  }

  private applyColumnWidths(worksheet: ExcelJS.Worksheet, columns: any[]): void {
    if (!worksheet.columns) return;
    
    worksheet.columns.forEach((column, index) => {
      if (!column) return;
      
      // Use predefined width
      if (columns[index]?.width) {
        column.width = columns[index].width;
        return;
      }
      
      // Calculate width based on content
      let maxLength = 0;
      
      // Check if eachCell method exists before calling it
      if (column.eachCell) {
        column.eachCell({ includeEmpty: true }, (cell) => {
          if (cell.value !== null && cell.value !== undefined) {
            const length = cell.value.toString().length;
            maxLength = Math.max(maxLength, length);
          }
        });
      }
      
      // Set reasonable limits for column width
      const calculatedWidth = Math.min(Math.max(maxLength + 2, 10), 50);
      column.width = calculatedWidth;
    });
  }

  private addSummarySection(worksheet: ExcelJS.Worksheet, dataLength: number): void {
    worksheet.addRow([]); // Empty row for spacing
    
    const summaryRow = worksheet.addRow([
      `Total Records Exported: ${dataLength}`
    ]);
    summaryRow.font = { 
      bold: true, 
      size: 12 
    };
    summaryRow.alignment = { 
      horizontal: 'right' 
    };
    worksheet.mergeCells(`A${summaryRow.number}:V${summaryRow.number}`);
  }

  private saveExcelFile(buffer: ArrayBuffer, recordCount: number): string {
    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19);
    const filename = `Proforma_Report_${timestamp}.xlsx`;
    
    // Create blob
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    // Create download link using native browser API
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL object
    window.URL.revokeObjectURL(url);
    
    console.log(`Excel report generated successfully: ${filename} (${recordCount} records)`);
    
    return filename;
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


