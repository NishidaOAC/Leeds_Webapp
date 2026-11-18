import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { NavItem } from './nav-item';
import { navItems } from '../sidebar-data';
import { Router } from '@angular/router';
import { NavService } from '../../../services/nav.service';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-item',
  imports: [ CommonModule, MatListModule, MatIconModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class AppNavItemComponent implements OnChanges, OnInit {
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() item: NavItem | any;

  expanded: any = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() depth: any;
  role!: string;
  constructor( public router: Router, private navService: NavService) {}
  ngOnInit(): void {
    const token: any = localStorage.getItem('user')
    const user = JSON.parse(token)
    this.role = user.power
  }

  hasAccess(item: NavItem): boolean {
    // If no roles specified, allow access to everyone
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    
    // Check if user's role is in the allowed roles array
    return item.roles.includes(this.role);
  }

  isRouteActive(route?: string): boolean {
    if (!route) return false;

    // 1. Direct exact match (ignoring query parameters and fragment)
    if (this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    })) {
      return true;
    }

    // 2. If another nav item is an exact match for current URL, do not activate this one
    const currentBaseUrl = this.router.url.split('?')[0].split('#')[0];
    const hasExactMatchingItem = navItems.some(item => item.route && item.route === currentBaseUrl);
    if (hasExactMatchingItem) {
      return false;
    }

    // 3. For deep child/detail routes without their own sidebar entry (e.g. /dashboard/payments/open/123),
    // highlight the nav item that forms the longest matching route prefix
    if (route !== '/dashboard' && currentBaseUrl.startsWith(route + '/')) {
      const longerMatch = navItems.some(
        other => other.route && other.route !== route && other.route.length > route.length && currentBaseUrl.startsWith(other.route)
      );
      return !longerMatch;
    }

    return false;
  }

  ngOnChanges() {
    const url = this.navService.currentUrl();
    if (this.item.route && url) {
      this.expanded = url.indexOf(`/${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (!this.expanded) {
      if (window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }

  openExternalLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}
