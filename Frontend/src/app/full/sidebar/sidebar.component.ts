import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BrandingComponent } from './branding.component';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';
import { filter } from 'rxjs';
import { SupplierService } from '../../pages/supplier/services/supplier.service';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { MatNavList } from '@angular/material/list';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, CommonModule, RouterModule,AppNavItemComponent,
    MatNavList,
    NgScrollbar,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  // This variable is required to fix your TS2339 error
  public filteredNavItems: NavItem[] = [];

constructor(private router: Router, private supplierService: SupplierService) {
  // Listen for navigation changes
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: any) => {
    // If the user navigates TO the supplier form directly from the menu 
    // (and not from an edit button), we clear the data.
    if (event.url === '/dashboard/supplier' && !this.router.navigated) {
       // Logic to clear only if intended as a NEW entry
    }
  });
}

  ngOnInit(): void {
    this.filterNavByRole();
  }

  

  filterNavByRole(): void {
    // 1. Get the 'user' object from localStorage as seen in your screenshot
    const userString = localStorage.getItem('user');
    
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        // 2. Access the 'name' field which contains "Quality Super Administrator"
        const userRole = userObj.name; 

        // 3. Filter the list
        this.filteredNavItems = navItems.filter(item => 
          item.roles && item.roles.includes(userRole)
        );
      } catch (error) {
        console.error("Auth Error:", error);
        this.filteredNavItems = [];
      }
    }
  }
}