import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    roles: ['Admin', 'Quality Super Administrator']
  },
  {
    displayName: 'Onboard Supplier',
    iconName: 'layout-grid-add',
    route: '/dashboard/supplier',
    roles: ['Admin', 'Quality Super Administrator']
  },
  {
    displayName: 'Supplier Directory',
    iconName: 'layout-grid-add',
    route: '/dashboard/supplier/supplierlist',
    roles: ['Admin', 'Quality Super Administrator']
  },
  {
    displayName: 'New Customer Account',
    iconName: 'layout-grid-add',
    route: '/dashboard/customer',
    roles: ['Admin', 'Quality Super Administrator']
  },
  {
    displayName: 'Customer Directory',
    iconName: 'layout-grid-add',
    route: '/dashboard/customer/customerlist',
    roles: ['Admin', 'Quality Super Administrator']
  },
  {
    displayName: 'Users',
    iconName: 'layout-grid-add',
    route: '/dashboard/users',
    roles: ['Admin', 'Quality Super Administrator']
  },
  // Items without 'Quality Super Administrator' will be hidden
  {
    displayName: 'Company',
    iconName: 'layout-grid-add',
    route: '/dashboard/company',
    roles: ['Admin']
  },
  {
    displayName: 'Role',
    iconName: 'layout-grid-add',
    route: '/dashboard/users/roles',
    roles: ['Admin']
  }
];