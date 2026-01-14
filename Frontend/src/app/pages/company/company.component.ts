/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from './company.service';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { AddCompanyComponent } from './add-company/add-company.component';
import { MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule ,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCardModule,
    MatPaginatorModule, 
    MatTabsModule,
    AddCompanyComponent, MatChipsModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CompanyComponent {
  companys: any[] = [];
  loading = true;
  dataSource1 = new MatTableDataSource<any>([]);
  displayedColumns1 = ['company', 'person', 'email', 'website', 'actions'];
  constructor(private ps: CompanyService, private router: Router) {}


  ngOnInit() {
    this.load();
  }

  onTabChange(event: MatTabChangeEvent): void {
    if(!this.isEdit) this.selectedCompany = null;
    this.isEdit = false;
  }

  applyFilter(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.load()
    // this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 1;
  search = '';
  isLoading = false;
  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
    this.load();
  }

  load() {
    this.isLoading = true;
    this.ps.getCompany(this.search, this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(res);
        
        this.dataSource1 = res.items;
        this.totalRecords = res.count;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }


  edit(company: any) {
    this.router.navigate([`/companys/${company.id}/edit`]);
  }


  viewVisits(company: any) {
    this.router.navigate([`/visits`], { queryParams: { companyId: company.id } });
  }

  private route = inject(ActivatedRoute);
  openCompany(row: any) {
    this.router.navigate(['../visit', row.id], { relativeTo: this.route });
  }

  selectedCompany: any = null
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  isEdit: boolean = false;
  editCompany(row: any) {
    this.isEdit = true;
    this.selectedCompany = row;
    this.tabGroup.selectedIndex = 1; // 🟢 switch to the 2nd tab
  }

  private snackBar = inject(MatSnackBar);
  deleteCompany(row: any) {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      this.ps.deleteCompany(row.id).subscribe({
        next: () => {
          this.load();
          this.snackBar.open('Company deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error deleting company', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onFormSaved(){
    this.tabGroup.selectedIndex = 0;
    this.load()
  }
}
