import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersServices } from '../users.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AddUser } from "./add-user/add-user";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users-list',
  imports: [MatCardModule, MatTabsModule, MatProgressSpinnerModule, MatFormFieldModule, MatIconModule, MatTableModule,
    MatPaginatorModule, AddUser, MatInputModule, MatButtonModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
  standalone: true
})
export class UsersList {
  users: any[] = [];
  loading = true;
  dataSource1 = new MatTableDataSource<any>([]);
  displayedColumns1 = ['user', 'username', 'role', 'actions'];
  constructor(private ps: UsersServices, private router: Router) {}


  ngOnInit() {
    this.load();
  }

  onTabChange(event: MatTabChangeEvent): void {
    if(!this.isEdit) this.selectedUser = null;
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
    this.ps.getAllUsers(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res: any) => {
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


  edit(user: any) {
    this.router.navigate([`/users/${user.id}/edit`]);
  }


  viewVisits(user: any) {
    this.router.navigate([`/visits`], { queryParams: { userId: user.id } });
  }

  private route = inject(ActivatedRoute);
  openUser(row: any) {
    this.router.navigate(['../visit', row.id], { relativeTo: this.route });
  }

  selectedUser: any = null
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  isEdit: boolean = false;
  editUser(row: any) {
    this.isEdit = true;
    this.selectedUser = row;
    this.tabGroup.selectedIndex = 1; // 🟢 switch to the 2nd tab
  }

  private snackBar = inject(MatSnackBar);
  deleteUser(row: any) {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      this.ps.deleteUser(row.id).subscribe({
        next: () => {
          this.load();
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onFormSaved(){
    this.tabGroup.selectedIndex = 0;
    this.load()
  }
}
