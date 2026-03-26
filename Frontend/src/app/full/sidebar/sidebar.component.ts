import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandingComponent } from './branding.component';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data'; // Ensure this path is correct

@Component({
  selector: 'app-sidebar',
  standalone: true,
  // CommonModule fixes @for/@if; RouterModule fixes [routerLink]
  imports: [BrandingComponent, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  // This fixes the "Property 'filteredNavItems' does not exist" error
  public filteredNavItems: NavItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filterNavByRole();
  }

  filterNavByRole(): void {
    // In your image, 'user' contains the object with the 'name' field
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // From your screenshot, the role is stored in 'name'
        const userRole = userData.name; 

        // Filter: Match the user's role against the roles array in sidebar-data.ts
        this.filteredNavItems = navItems.filter(item => 
          item.roles && item.roles.includes(userRole)
        );
      } catch (error) {
        console.error("Error parsing user data", error);
        this.filteredNavItems = [];
      }
    } else {
      this.filteredNavItems = [];
    }
  }
}