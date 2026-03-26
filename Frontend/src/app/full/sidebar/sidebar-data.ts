






import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavItem } from './nav-item/nav-item';

// 1. Define the data array first so the Component can access it

export const navItems: NavItem[] = [
 // path to your navItems file


  // {
  //   navCap: 'Home',
  // },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'user'] 
  },
  // {
  //   displayName: 'NewPayment',
  //   iconName: 'layout-grid-add',
  //   route: '/dashboard/payments/addpayments',
  //   bgcolor: 'primary',
  //   roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM'] 
  // },
  // {
  //   displayName: 'Payments',
  //   iconName: 'layout-grid-add',
  //   route: '/dashboard/payments',
  //   bgcolor: 'primary',
  //   roles: ['Admin', 'Manager', 'user', 'SalesExecutive', 'KAM', 'Accountant'] // All roles can view payments
  // },'
     {
    displayName: 'Onboard Supplier',
    iconName: 'layout-grid-add',
    route: '/dashboard/supplier',
    bgcolor: 'primary',
    roles: ['Admin']
  },
      {
    displayName: 'Supplier Directory',
    iconName: 'layout-grid-add',
    route: '/dashboard/supplier/supplierlist',
    bgcolor: 'primary',
    roles: ['Admin']
  },
    {
    displayName: 'New Customer Account',
    iconName: 'layout-grid-add',
    route: '/dashboard/customer',
    bgcolor: 'primary',
    roles: ['Admin'] 
  },
      {
    displayName: 'Customer Directory',
    iconName: 'layout-grid-add',
    route: '/dashboard/customer/customerlist',
    bgcolor: 'primary',
    roles: ['Admin'] 
  },
 

  {
    displayName: 'Company',
    iconName: 'layout-grid-add',
    route: '/dashboard/company',
    bgcolor: 'primary',
    roles: ['Admin'] // Only admin can manage company
  },
  {
    displayName: 'Users',
    iconName: 'layout-grid-add',
    route: '/dashboard/users',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager'] // Only admin can manage users
  },
  {
    displayName: 'Role',
    iconName: 'layout-grid-add',
    route: '/dashboard/users/roles',
    bgcolor: 'primary',
    roles: ['Admin'] // Only admin can manage roles
  },
  {
    displayName: 'Team',
    iconName: 'layout-grid-add',
    route: '/dashboard/users/teams',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager'] // Admin and managers can manage teams
  },
  {
    displayName: 'Report',
    iconName: 'layout-grid-add',
    route: '/dashboard/payments/report',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM', 'Accountant'] // Admin and managers can view reports
  },
  
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  // --- ADDED THESE TO FIX THE ERRORS ---
// --- THESE PROPERTIES FIX YOUR TEMPLATE ERRORS ---
  @Input() showToggle = true; 
  @Output() toggleMobileNav = new EventEmitter<void>();
  // -------------------------------------------------
  // Use NavItem type for better type safety
  public filteredNavItems: NavItem[] = [];

  ngOnInit() {
    this.filterNavByRole();
  }

  filterNavByRole() {
    const userDataString = localStorage.getItem('userData');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // Based on your image, userData contains a "role" field
        const userRole = userData.role; 

        // Filter: Only keep items where the user's role exists in the item's roles array
        this.filteredNavItems = navItems.filter(item => 
          item.roles && item.roles.includes(userRole)
        );
      } catch (error) {
        console.error("Error parsing userData from localStorage", error);
        this.filteredNavItems = [];
      }
    } else {
      // If no user data found, sidebar stays empty for security
      this.filteredNavItems = [];
    }
  }
}