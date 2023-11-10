import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faBars,
  faCaretRight,
  faCaretDown,
  faBurger,
  faGear,
  faBoxArchive,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarMenuItem } from 'src/app/models/sidebar-menu-item.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('trigger', [
      state(
        'closed',
        style({
          opacity: 0,
          display: 'block',
          height: 0,
        })
      ),
      state(
        'open',
        style({
          opacity: 1,
          display: 'block',
        })
      ),

      transition(
        'closed => open',
        animate(
          300,
          keyframes([
            style({ height: '0' }),
            style({ height: '*' }),
            style({ opacity: 0 }),
            style({ opacity: '0.9' }),
            // style({ display: 'block' }),
          ])
        )
      ),
      transition(
        'open => closed',
        animate(
          150,
          keyframes([
            style({ opacity: '0.5' }),
            style({ opacity: 0 }),
            style({ height: '*' }),
            style({ height: '0' }),
          ])
        )
      ),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  @Output() hideSidebarEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Input() public sidebarOpenClosedInput!: boolean;
  @Input({ required: true }) public sideBarMenuItem: SidebarMenuItem[] = [];
  public hideSidebar!: boolean;
  public hideSidebarText!: boolean;
  public hideMenuItem!: boolean;
  public hideIcon!: boolean;
  public state: string = 'closed';
  public barIcon = faBars;
  public arrowRightIcon: IconDefinition = faCaretRight;
  public arrowDownIcon = faCaretDown;
  constructor() {}

  public ngOnInit(): void {
    this.hideSidebar = this.sidebarOpenClosedInput;
    this.hideSidebarText = this.sidebarOpenClosedInput;
    this.hideMenuItem = this.sidebarOpenClosedInput;
    this.hideIcon = this.sidebarOpenClosedInput;

    /* this.sideBarMenuItem = [
      {
        label: 'Orders',
        fontAwesomeIcon: this.burgerIcon,
        routerUrl: '/orders',
      },
      {
        label: 'Archive',
        fontAwesomeIcon: this.archiveIcon,
        routerUrl: '/archive',
      },
      {
        label: 'Settings',
        fontAwesomeIcon: this.settingsIcon,
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
    */

    this.hideSidebarEvent.emit(this.hideSidebar);
  }

  public showSidebar(): void {
    this.hideSidebar = !this.hideSidebar;
    this.sidebarOpenClosedInput = this.hideSidebar;
    this.hideSidebarEvent.emit(this.hideSidebar);

    if (this.hideSidebarText) {
      setTimeout(() => {
        this.hideSidebarText = false;
      }, 230);
    } else {
      this.hideSidebarText = true;
    }
  }

  public hideList(): void {
    this.state = this.state == 'closed' ? 'open' : 'closed';
    this.changeIcon();
  }

  public changeIcon(): void {
    this.hideIcon = !this.hideIcon;
  }
}
