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
  iconName: 'add_business',
  route: '/dashboard/supplier',
  roles: ['QualityAdmin', 'Quality Super Administrator']
},
{
  displayName: 'Supplier Directory',
  iconName: 'storefront',
  route: '/dashboard/supplier/supplierlist',
  roles: ['QualityAdmin', 'Quality Super Administrator', 'Admin', 'Manager', 'SalesExecutive', 'KAM']
},
  {
    displayName: 'NewPayment',
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