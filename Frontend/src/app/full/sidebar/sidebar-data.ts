import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'grid_view',
    route: '/dashboard',
    bgcolor: 'primary',
    // 🟢 Quality allowed
    roles: ['Admin', 'QualityAdmin', 'Manager', 'user', 'SalesExecutive', 'KAM', 'Accountant'] 
  },
  {
    displayName: 'Onboard Supplier',
    iconName: 'person_add',
    route: '/dashboard/supplier',
    // 🟢 Quality allowed
    roles: ['QualityAdmin']
  },
  {
    displayName: 'Supplier Directory',
    iconName: 'folder_shared',
    route: '/dashboard/supplier/supplierlist',
    // 🟢 Quality allowed
    roles: ['QualityAdmin', 'Admin', 'Manager', 'SalesExecutive', 'KAM']
  },
  {
    displayName: 'New Payment',
    iconName: 'add_card',
    route: '/dashboard/payments/addpayments',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM']
  },
  {
    displayName: 'Payments',
    iconName: 'payments',
    route: '/dashboard/payments',
    bgcolor: 'primary',
    roles: ['Admin', 'Manager', 'user', 'SalesExecutive', 'KAM', 'Accountant']
  },
  {
    displayName: 'Customer',
    iconName: 'business',
    route: '/dashboard/company',
    bgcolor: 'primary',
    roles: ['Admin', 'KAM']
  },
  {
    displayName: 'Users',
    iconName: 'manage_accounts',
    route: '/dashboard/users',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager']
  },
  {
    displayName: 'Roles',
    iconName: 'admin_panel_settings',
    route: '/dashboard/users/roles',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin']
  },
  {
    displayName: 'Teams',
    iconName: 'groups',
    route: '/dashboard/users/teams',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager']
  },
  {
    displayName: 'Reports',
    iconName: 'bar_chart',
    route: '/dashboard/payments/report',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM', 'Accountant']
  }
];