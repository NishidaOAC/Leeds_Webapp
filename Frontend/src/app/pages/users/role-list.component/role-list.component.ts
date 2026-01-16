import { Component, inject, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleForm } from "./role-form/role-form";
import { DesignationServices } from './designation.service';

@Component({
  selector: 'app-role-list.component',
  imports: [MatCardModule, MatTableModule, MatProgressBarModule, MatIconModule, MatMenuModule, MatButtonModule,
    MatTabsModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSortModule, RoleForm],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent {
   roles: any[] = [];
   loading = true;
   dataSource1 = new MatTableDataSource<any>([]);
   displayedColumns1 = ['role', 'abbreviation', 'actions'];
   constructor(private ps: DesignationServices, private router: Router) {}
 
 
   ngOnInit() {
     this.load();
   }
 
   onTabChange(event: MatTabChangeEvent): void {
     if(!this.isEdit) this.selectedRole = null;
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
     this.ps.getRoles().subscribe({
       next: (res: any) => {
        console.log(res);
        
         this.dataSource1.data = res;
        //  this.totalRecords = res.count;
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
 
 
   edit(role: any) {
     this.router.navigate([`/roles/${role.id}/edit`]);
   }
 
 
   viewVisits(role: any) {
     this.router.navigate([`/visits`], { queryParams: { roleId: role.id } });
   }
 
   private route = inject(ActivatedRoute);
   openRole(row: any) {
     this.router.navigate(['../visit', row.id], { relativeTo: this.route });
   }
 
   selectedRole: any = null
   @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
   isEdit: boolean = false;
   editRole(row: any) {
     this.isEdit = true;
     this.selectedRole = row;
     this.tabGroup.selectedIndex = 1; // 🟢 switch to the 2nd tab
   }
 
   private snackBar = inject(MatSnackBar);
   deleteRole(row: any) {
     if (confirm(`Are you sure you want to delete ${row.roleName}?`)) {
       this.ps.deleteRole(row.id).subscribe({
         next: () => {
           this.load();
           this.snackBar.open('Role deleted successfully', 'Close', { duration: 3000 });
         },
         error: (err) => {
           this.snackBar.open('Error deleting role', 'Close', { duration: 3000 });
         },
       });
     }
   }
 
   onFormSaved(){
     this.tabGroup.selectedIndex = 0;
     this.load()
   }
 }
 