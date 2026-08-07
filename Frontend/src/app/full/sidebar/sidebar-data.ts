import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: '/dashboard',
    bgcolor: 'primary',
    // 🟢 Quality allowed
    roles: ['Admin', 'QualityAdmin', 'Quality Super Administrator', 'Manager', 'user', 'superadministrator'] 
  },
  {
    displayName: 'Onboard Supplier',
    iconName: 'person_add',
    route: '/dashboard/supplier',
    // 🟢 Quality allowed
    roles: ['QualityAdmin', 'Quality Super Administrator']
  },
  {
    displayName: 'Supplier Directory',
    iconName: 'folder_shared',
    route: '/dashboard/supplier/supplierlist',
    // 🟢 Quality allowed
    roles: ['QualityAdmin', 'Quality Super Administrator', 'Admin', 'Manager', 'SalesExecutive', 'KAM']
  },
  {
    displayName: 'NewPayment',
    iconName: 'add_card',
    route: '/dashboard/payments/addpayments',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM']
  },
  {
    displayName: 'Payments',
    iconName: 'payments',
    route: '/dashboard/payments',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager', 'user', 'SalesExecutive', 'KAM', 'Accountant']
  },
  {
    displayName: 'Company',
    iconName: 'business',
    route: '/dashboard/company',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin']
  },
  {
    displayName: 'Users',
    iconName: 'people',
    route: '/dashboard/users',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager']
  },
  {
    displayName: 'Role',
    iconName: 'admin_panel_settings',
    route: '/dashboard/users/roles',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin']
  },
  {
    displayName: 'Team',
    iconName: 'groups',
    route: '/dashboard/users/teams',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager']
  },
  {
    displayName: 'Report',
    iconName: 'bar_chart',
    route: '/dashboard/payments/report',
    bgcolor: 'primary',
    // 🔴 Quality removed
    roles: ['Admin', 'Manager', 'SalesExecutive', 'KAM', 'Accountant']
  }
];