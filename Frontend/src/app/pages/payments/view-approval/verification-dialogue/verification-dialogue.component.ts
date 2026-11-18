/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersServices } from '../../../users/users.service';
import { User } from '../../../users/users-list/user.model';

@Component({
  selector: 'app-verification-dialogue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './verification-dialogue.component.html',
  styleUrl: './verification-dialogue.component.scss'
})
export class VerificationDialogueComponent implements OnInit, OnDestroy {
  loginService = inject(UsersServices);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<VerificationDialogueComponent>);
  dialogData = inject(MAT_DIALOG_DATA);

  userSub?: Subscription;

  form = this.fb.group({
    remarks: [''],
    kamId: [],
    amId: [],
    accountantId: [],
    spId: [''],
  });

  invoiceNo!: string;
  status!: string;
  isSelectionMade: boolean = false;

  am: User[] = [];
  kam: User[] = [];

  ngOnInit(): void {
    this.invoiceNo = this.dialogData?.invoiceNo || '';
    this.status = this.dialogData?.status || '';

    if (this.dialogData?.sp) {
      this.form.get('spId')?.setValue(this.dialogData.sp);
    }

    if (this.status === 'KAM VERIFIED') {
      this.getAm();
    } else if (this.status === 'AM VERIFIED' || this.status === 'AM Verified') {
      this.getMa();
    } else if (this.status === 'AM APPROVED') {
      this.getKam();
    }

    this.updateSelectionState();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onSelectionChange(): void {
    this.updateSelectionState();
  }

  updateSelectionState(): void {
    if (this.status === 'KAM VERIFIED') {
      this.isSelectionMade = !!this.form.get('amId')?.value;
    } else if (this.status === 'AM VERIFIED' || this.status === 'AM Verified') {
      this.isSelectionMade = !!this.form.get('accountantId')?.value;
    } else if (this.status === 'AM APPROVED') {
      this.isSelectionMade = !!this.form.get('kamId')?.value;
    } else {
      // Rejections or statuses without assignment requirement
      this.isSelectionMade = true;
    }
  }

  getSelectedUserName(id: any, list: User[]): string {
    if (!id || !list || list.length === 0) return '';
    const user = list.find(u => u.id === id);
    return user ? user.name : '';
  }

  getStatusLabel(status: string): string {
    if (!status) return '';
    return status.replace(/_/g, ' ');
  }

  isRejectStatus(): boolean {
    return /reject|decline/i.test(this.status || '');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    const data = {
      value: true,
      remarks: this.form.get('remarks')?.value,
      kamId: this.form.get('kamId')?.value,
      amId: this.form.get('amId')?.value,
      accountantId: this.form.get('accountantId')?.value
    };
    this.dialogRef.close(data);
  }

  getAm(): void {
    this.userSub = this.loginService.getUserByRoleName('Manager').subscribe(data => {
      this.am = data;
    });
  }

  getKam(): void {
    this.userSub = this.loginService.getUserByRoleName('Key Account Manager').subscribe(data => {
      this.kam = data;
    });
  }

  getMa(): void {
    this.userSub = this.loginService.getUserByRoleName('Accountant').subscribe(data => {
      this.am = data;
    });
  }
}
