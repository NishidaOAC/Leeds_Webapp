import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandingComponent } from './branding.component';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  // This variable is required to fix your TS2339 error
  public filteredNavItems: NavItem[] = [];

  constructor() {}

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