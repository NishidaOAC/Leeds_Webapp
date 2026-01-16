import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from '../team.service';
import { MatDivider } from "@angular/material/divider";
import { User } from '../../users-list/user.model';
import { UsersServices } from '../../users.service';

@Component({
  selector: 'app-team-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatOptionModule, MatButtonModule, MatInputModule, MatSelectModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule, MatChipsModule, MatDivider],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss',
  standalone: true,
})
export class TeamForm {
  teamForm: FormGroup;
  isEdit = false;
  isLoading = false;
  teamId: number | null = null;
  @Input() team: any = null;
  @Output() formSaved = new EventEmitter<void>();
  accessOptions = ['read', 'write', 'delete', 'manage_users', 'manage_teams', 'view_reports'];
  
  get selectedAccessCount(): number {
    return this.teamForm.get('access')?.value?.length || 0;
  }

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team'] && this.team) {
      this.isEdit = true;
      this.teamId = this.team.id;

      const teamLeadersSource = this.team.TeamLeaders || this.team.teamLeaders || [];
      const teamMembersSource = this.team.TeamMembers || this.team.teamMembers || [];

      const leaderIds = teamLeadersSource.map((leader: any) =>
        typeof leader === 'number' ? leader : leader.userId
      );

      const memberIds = teamMembersSource.map((member: any) =>
        typeof member === 'number' ? member : member.userId
      );

      this.teamForm.patchValue({
        teamName: this.team.teamName,
        teamLeaders: leaderIds,
        teamMembers: memberIds,
        access: this.team.access || []
      });
    } else if (!this.team) {
      this.isEdit = false;
      this.teamForm.reset();
    }
  }

  ngOnInit(): void {
    this.getUsers();
    
  }

  manageUser(){
  }

  users: User[] = [];
  private userService = inject(UsersServices);
  getUsers() {
    this.userService.getAllUsers().subscribe((result) => {
      this.users = result;
      console.log(this.users);
      
    })
  }

  createForm(): FormGroup {
    return this.fb.group({      
      teamName: ['', [Validators.required, Validators.minLength(2)]],
      teamLeaders: [[], Validators.required],
      teamMembers: [[], Validators.required],
      access: [[]]
    });
  }

  isAccessSelected(access: string): boolean {
    const currentAccess: string[] = this.teamForm.get('access')?.value || [];
    return currentAccess.includes(access);
  }

  toggleAccess(access: string): void {
    const accessControl = this.teamForm.get('access');
    if (accessControl) {
      const currentAccess: string[] = accessControl.value || [];
      const index = currentAccess.indexOf(access);
      
      if (index > -1) {
        currentAccess.splice(index, 1);
      } else {
        currentAccess.push(access);
      }
      
      accessControl.setValue(currentAccess);
      accessControl.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.isLoading = true;
      const teamData = this.teamForm.value;
      
      if (this.isEdit && this.teamId) {
        this.teamService.updateTeam(this.teamId, teamData).subscribe({
          next: (response: any) => {
            console.log(response);
            
            this.isLoading = false;
            this.teamForm.reset();
            this.formSaved.emit();
          },
          error: (error: any) => {
            this.isLoading = false;
          }
        });
      } else {
        this.teamService.createTeam(teamData).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            this.teamForm.reset();
            this.formSaved.emit();
          },
          error: (error: any) => {
            this.isLoading = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.teamForm.controls).forEach(key => {
        this.teamForm.get(key)?.markAsTouched();
      });
    }
  }

  onReset(): void {
    // if (this.isEdit && this.teamId) {
    //   this.loadTeam(this.teamId);
    // } else {
    //   this.teamForm.reset();
    //   this.teamForm.get('access')?.setValue([]);
    // }
  }
}
