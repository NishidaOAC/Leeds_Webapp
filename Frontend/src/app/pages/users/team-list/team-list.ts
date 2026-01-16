import { Component, inject, ViewChild } from '@angular/core';
import { TeamService } from './team.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTabsModule, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamForm } from "./team-form/team-form";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-team-list',
  imports: [MatCardModule, MatTableModule, MatProgressBarModule, MatIconModule, MatMenuModule, MatButtonModule,
    MatTabsModule, MatPaginatorModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSortModule, TeamForm, MatDividerModule],
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
  standalone: true,
})
export class TeamList {
   teams: any[] = [];
   loading = true;
   dataSource1 = new MatTableDataSource<any>([]);
   displayedColumns1 = ['teamName', 'leaders', 'members', 'totalUsers', 'actions'];
   constructor(private service: TeamService, private router: Router) {}
 
 
   onRowClick(row: any) {
     this.router.navigate([`/teams/${row.id}`]);
   }

   ngOnInit() {
     this.load();
   }
 
   onTabChange(event: MatTabChangeEvent): void {
     if(!this.isEdit) this.selectedTeam = null;
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
     this.service.getTeams().subscribe({
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
 
 
   edit(team: any) {
     this.router.navigate([`/teams/${team.id}/edit`]);
   }
 
 
   viewVisits(team: any) {
     this.router.navigate([`/visits`], { queryParams: { teamId: team.id } });
   }
 
   private route = inject(ActivatedRoute);
   openTeam(row: any) {
     this.router.navigate(['../visit', row.id], { relativeTo: this.route });
   }
 
   selectedTeam: any = null
   @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
   isEdit: boolean = false;
   editTeam(row: any) {
     this.isEdit = true;
     this.selectedTeam = row;
     this.tabGroup.selectedIndex = 1; // 🟢 switch to the 2nd tab
   }
 
   private snackBar = inject(MatSnackBar);
   deleteTeam(row: any) {
     if (confirm(`Are you sure you want to delete ${row.teamName}?`)) {
       this.service.deleteTeam(row.id).subscribe({
         next: () => {
           this.load();
           this.snackBar.open('Team deleted successfully', 'Close', { duration: 3000 });
         },
         error: (err) => {
           this.snackBar.open('Error deleting team', 'Close', { duration: 3000 });
         },
       });
     }
   }
 
   onFormSaved(){
     this.tabGroup.selectedIndex = 0;
     this.load()
   }
 }
 
