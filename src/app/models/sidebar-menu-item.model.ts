import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface SidebarMenuItem {
  label: string;
  fontAwesomeIcon?: IconDefinition;
  items?: SidebarMenuItem[];
  routerUrl: string;
}
