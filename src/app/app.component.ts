import { Component, OnInit, ViewChild } from '@angular/core';
import {
  faBars,
  faBoxArchive,
  faBurger,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { SidebarMenuItem } from './models/sidebar-menu-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(SidebarComponent) child!: SidebarComponent;

  public loading: boolean = true;
  public barsIcon = faBars;
  public title = 'kds-client';
  public sidebarMenuitems!: SidebarMenuItem[];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      switch (event.constructor) {
        case NavigationStart: {
          this.loading = true;
          break;
        }
        case NavigationEnd: {
          this.loading = false;
          break;
        }
        case NavigationCancel:
        case NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  public ngOnInit(): void {
    this.sidebarMenuitems = this.initSidebarMenuItem();
  }

  public showSidebar() {
    this.child.showSidebar();
  }

  public initSidebarMenuItem(): SidebarMenuItem[] {
    return [
      {
        label: 'Orders',
        fontAwesomeIcon: faBurger,
        routerUrl: '/orders',
      },
      {
        label: 'Archive',
        fontAwesomeIcon: faBoxArchive,
        routerUrl: '/archive',
      },
      {
        label: 'Settings',
        fontAwesomeIcon: faGear,
        routerUrl: '#',
        items: [
          {
            label: 'User settings',
            routerUrl: '#',
          },
          {
            label: 'Change password',
            routerUrl: '#',
          },
        ],
      },
    ];
  }
}
