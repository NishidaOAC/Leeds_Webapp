import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UsersServices } from '../../../users/users.service';
import { User } from '../../../users/users-list/user.model';

@Component({
  standalone: true,
  selector: 'app-kam-unavailable',
  imports: [MatRadioModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './kam-unavailable.component.html',
  styleUrl: './kam-unavailable.component.scss'
})
export class KAMUnavailableComponent implements OnInit, OnDestroy{
  ngOnInit(): void {
    this.loadKams();
  }
  selectedOption = 'approve';
  selectedKam!: string;
  private readonly dialogRef = inject(MatDialogRef<KAMUnavailableComponent>)
  data = inject(MAT_DIALOG_DATA);
  private readonly userService = inject(UsersServices); 
  private kamSub!: Subscription;


  kam: User[] = [];
  loadKams() {
    this.kamSub = this.userService.getUserByRoleName('Key Account Manager')
      .subscribe(users => {
        this.kam = users;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedOption === 'approved' || this.selectedOption === 'rejected') {
      this.dialogRef.close({ action: this.selectedOption });
    } else {
      this.dialogRef.close({ 
        action: 'changeKam', 
        newKam: this.selectedKam 
      });
    }
  }

  ngOnDestroy(): void {
    this.kamSub?.unsubscribe();
  }
}
