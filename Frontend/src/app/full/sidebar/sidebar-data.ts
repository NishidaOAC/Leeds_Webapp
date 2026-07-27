import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'dashboard', // Fixed icon name
    route: '/dashboard',
    bgcolor: 'primary',
    roles: ['Admin', 'QualityAdmin', 'Manager', 'user', 'superadministrator'] 
  },
  {
    displayName: 'Onboard Supplier',
    iconName: 'person_add',
    route: '/dashboard/supplier',
    roles: ['QualityAdmin', 'superadministrator']
  },
  {
    displayName: 'Supplier Directory',
    iconName: 'folder_shared',
    route: '/dashboard/supplier/supplierlist',
    roles: ['QualityAdmin', 'Admin']
  },
  {
    displayName: 'NewPayment',
    iconName: 'add_card',
    route: '/dashboard/payments/addpayments',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM', 'superadministrator']
  },
  {
    displayName: 'Payments',
    iconName: 'payments',
    route: '/dashboard/payments',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'user', 'SalesExecutive', 'KAM', 'Accountant', 'superadministrator']
  },
  {
    displayName: 'Company',
    iconName: 'business',
    route: '/dashboard/company',
    bgcolor: 'primary',
    roles: ['Admin', 'superadministrator']
  },
  {
    displayName: 'Users',
    iconName: 'people',
    route: '/dashboard/users',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'superadministrator']
  },
  {
    displayName: 'Role',
    iconName: 'admin_panel_settings',
    route: '/dashboard/users/roles',
    bgcolor: 'primary',
    roles: ['Admin', 'superadministrator']
  },
  {
    displayName: 'Team',
    iconName: 'groups',
    route: '/dashboard/users/teams',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'superadministrator']
  },
  {
    displayName: 'Report',
    iconName: 'bar_chart',
    route: '/dashboard/payments/report',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM', 'Accountant', 'superadministrator']
  }
];