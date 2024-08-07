import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Home',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/solid/home.svg',
          label: 'Home',
          route: '/dashboard/home',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Usuários',
          route: '/dashboard/users',
          role: 'admin'
        },
      ],
    }
  ];
}
