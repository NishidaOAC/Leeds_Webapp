import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, QueryList, ViewChildren } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ViewApprovalComponent } from './view-approval/view-approval.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { InvoiceService } from './invoice.service';
import { DesignationServices } from '../users/role-list.component/designation.service';

@Component({
  selector: 'app-payments',
  imports: [MatCardModule, MatTabsModule, MatIconModule, ViewApprovalComponent, CommonModule],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})
export class Payments {
  currentTabIndex: number = 0;
  currentPage: number = 1;
  private readonly route = inject(ActivatedRoute);
  private refreshSub!: Subscription;
  role!: string;
  ngOnInit(): void {
    const token: any = localStorage.getItem('user')
    const user = JSON.parse(token)
    this.role = user.role;
    this.roleName = user.power;
    this.refreshSub = interval(5000).subscribe(() => {
      this.getRoleById();
    });
    this.getRoleById();
  }

  @ViewChildren('viewApproval') viewApprovalComponents!: QueryList<ViewApprovalComponent>;
  data: any;
  private invoiceService = inject(InvoiceService);
  isSubmitted!: true;
  status: string = '';
  header: string = '';
  pageStatus: boolean = true;
  dataToPass: any;

  roleSub!: Subscription;
  roleName: string = 'Administrator';
  sp: boolean = false;
  kam: boolean = false;
  am: boolean = false;
  ma: boolean = false;
  admin: boolean = false;
  teamLead: boolean = false;
  pendingHeader : string = '';
  private roleService = inject(DesignationServices);
  isViewReady = false;
  private cdr = inject(ChangeDetectorRef);
  
  // Track if status was set by user tab interaction
  private statusSetByUser: boolean = false;
  
  getRoleById(){
      // Only set default status if not set by user yet
      const shouldSetDefaultStatus = !this.statusSetByUser && !this.status;
      
      if(!this.isSubmitted){
        if(this.roleName === 'SalesExecutive') { 
          this.status = 'GENERATED'; this.sp = true; this.header = 'REJECTED'; this.pendingHeader='GENERATED'
         }
        if(this.roleName === 'KAM') { 
          this.status = 'GENERATED'; this.kam = true; this.header = 'AM REJECTED'; this.pendingHeader='GENERATED'
        }
        if(this.roleName === 'Manager') { 
          this.status = 'KAM VERIFIED'; this.am = true; this.header = 'REJECTED'; this.pendingHeader='VERIFIED'
        }
        if(this.roleName === 'Accountant') { 
          this.status = 'AM VERIFIED'; this.ma = true; this.pendingHeader='VERIFIED'
        }
        if(this.roleName === 'Admin' || this.roleName === 'Super Administrator') { 
          this.admin = true; 
          // Only set status to default if not set by user yet
          if (shouldSetDefaultStatus) {
            this.status = '';
          }
        }
        if(this.role === 'Team Lead') { this.teamLead = true }
      }else{
        // Only set status to default if not set by user yet
        if (shouldSetDefaultStatus) {
          this.status = '';
        }
        this.pageStatus = false;
        if(this.roleName === 'Sales Executive') { 
          this.sp = true; this.header = 'REJECTED'; this.pendingHeader='GENERATED'
         }
        if(this.roleName === 'Key Account Manager') { 
          this.kam = true; this.header = 'AM REJECTED'; this.pendingHeader='GENERATED'
        }
        if(this.roleName === 'Manager') { 
          this.am = true; this.header = 'REJECTED'; this.pendingHeader='VERIFIED'
        }
        if(this.roleName === 'Accountant') { 
          this.ma = true; this.pendingHeader='VERIFIED'
        }
      }
      this.data = {
        status: this.status,
        roleName: this.roleName,
        sp: this.sp,
        kam: this.kam,
        am: this.am,
        ma: this.ma,
        admin: this.admin,
        teamLead: this.teamLead,
        pageStatus: this.pageStatus
      }

      // Mark view as ready and initialize tabs
      if (!this.isViewReady) {
        this.isViewReady = true;
        this.cdr.detectChanges();
        
        // Wait for the next tick to ensure DOM is updated
        setTimeout(() => {
          this.initializeTabs();
        });
      } else {
        this.updateActiveTab();
      }
  }
    private initializeTabs(): void {
    const tabIndex = this.invoiceService.getState('tabIndex');
    
    if (tabIndex !== undefined && tabIndex !== null) {
      this.selectedTabIndex = tabIndex.tabIndex;
    } else {
      this.selectedTabIndex = 0;
    }
    
    // Ensure tab group is fully rendered
    setTimeout(() => {
      this.onTabChange(this.selectedTabIndex);
    });
  }
  
  private updateActiveTab(): void {
    // Update the currently active tab with new data
    setTimeout(() => {
      if (!localStorage.getItem('JWT_TOKEN')) {
        return;
      }
      if (this.viewApprovalComponents.length > this.selectedTabIndex) {
        const activeComponent = this.viewApprovalComponents.toArray()[this.selectedTabIndex];
        if (activeComponent) {
          activeComponent.loadData(this.data, this.selectedTabIndex);
        }
      }
    });
  }
  
  selectedTabIndex: number = 0;
  onTabChange(event: number) {
    switch (this.roleName) {
      case 'SalesExecutive':
        switch (event) {
          case 0:
            this.data.status = 'GENERATED';
            this.data.pageStatus = true;
            break;
          case 1:
            this.data.status = 'BANK SLIP ISSUED';
            this.data.pageStatus = false;
            break;
          case 2:
            this.data.status = 'REJECTED';
            this.data.pageStatus = false;
            break;
          case 3:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          default:
            this.data.status = 'GENERATED';
            this.data.pageStatus = false;
            break;
        };
        break;
      case 'Key Account Manager':
        switch (event) {
          case 0:
            this.data.status = 'GENERATED';
            this.data.pageStatus = true;
            break;
          case 1:
            this.data.status = ['KAM VERIFIED', 'KAM REJECTED'];
            this.data.pageStatus = true;
            break;
          case 2:
            this.data.status = 'BANK SLIP ISSUED';
            this.data.pageStatus = false;
            break;
          case 3:
            this.data.status = 'AM REJECTED';
            this.data.pageStatus = false;
            break;
          case 4:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          default:
            this.data.status = 'GENERATED';
            this.data.pageStatus = false;
            break;
        }
        break;
      case 'Manager':
        switch (event) {
          case 0:
            this.data.status = 'KAM VERIFIED';
            this.data.pageStatus = true;
            break;
          case 1:
            this.data.status = ['AM VERIFIED', 'AM REJECTED'];
            this.data.pageStatus = true;
            break;
          case 2:
              this.data.status = 'GENERATED';
              this.data.pageStatus = false;
              break;
          case 3:
            this.data.status = 'BANK SLIP ISSUED';
            this.data.pageStatus = false;
            break;
          case 4:
            this.data.status = 'REJECTED';
            this.data.pageStatus = false;
            break;
          case 5:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          case 6:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          default:
            this.data.status = 'KAM VERIFIED';
            this.data.pageStatus = false;
            break;
        } 
        break;
      case 'Accountant':
        switch (event) {
          case 0:
            this.data.status = 'AM VERIFIED';
            this.data.pageStatus = false;
            break;
          case 1:
            this.data.status = 'BANK SLIP ISSUED';
            this.data.pageStatus = false;
            break;
          case 2:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          case 3:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          default:
            this.data.status = 'AM VERIFIED';
            break;
        } 
        break;

      case 'Super Administrator':
        switch (event) {
          case 0:
            this.data.status = 'GENERATED';
            this.data.pageStatus = true;
            break;
          case 1:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
          default:
            this.data.status = '';
            this.data.pageStatus = false;
            break;
        }
        break;
      default:
          switch (event) {
            case 0:
              this.data.status = 'GENERATED';
              break;
            case 1:
              this.data.status = '';
              break;
            case 2:
              this.data.status = 'AM REJECTED';
              break;
            case 3:
              this.data.status = '';
              break;
            default:
              this.data.status = 'GENERATED';
              break;
          }
          break;
    }
    
    // Sync this.status with this.data.status so interval uses user's selected status
    this.status = this.data.status;
    this.statusSetByUser = true;
    
    if (event === 0 && this.viewApprovalComponents.length > 0 && (this.roleName === 'Administrator' || this.roleName === 'Super Administrator')) {
      const activeComponent = this.viewApprovalComponents.toArray()[0]; 
      if (activeComponent) {
        activeComponent.loadData(this.data, event);
      } 
    }  
    // else if (event === 1 && this.viewExpenseComponent.length > 0 && (this.roleName === 'Administrator' || this.roleName === 'Super Administrator')) {
    //   const activeComponent = this.viewExpenseComponent.toArray()[0]; 
    //   if (activeComponent) {
    //     activeComponent.loadData(this.data, event);
    //   } 
    // } 
    else if (this.viewApprovalComponents.length > 0) {
      const activeComponent = this.viewApprovalComponents.toArray()[event];
      if (activeComponent) {
        activeComponent.loadData(this.data, event);
      } 
    }

  }
  
}