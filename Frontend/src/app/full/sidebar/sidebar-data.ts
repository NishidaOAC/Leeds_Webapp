import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
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
