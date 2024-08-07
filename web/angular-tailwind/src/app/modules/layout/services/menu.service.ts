import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/constants/menu';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();
  private userRole: string = ''; // Adicione uma variável para armazenar o papel do usuário

  constructor(private router: Router) {
    this._pagesMenu.set(Menu.pages);

    let sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.filterMenu(); // Filtra o menu com base no papel do usuário
        this._pagesMenu().forEach((menu) => {
          let activeGroup = false;
          menu.items.forEach((subMenu) => {
            const active = this.isActive(subMenu.route);
            subMenu.expanded = active;
            subMenu.active = active;
            if (active) activeGroup = true;
            if (subMenu.children) {
              this.expand(subMenu.children);
            }
          });
          menu.active = activeGroup;
        });
      }
    });
    this._subscription.add(sub);
  }

  // Adicione um método para definir o papel do usuário
  setUserRole(role: string) {
    this.userRole = role;
    this.filterMenu(); // Filtra o menu sempre que o papel do usuário for atualizado
  }

  // Adicione um método para filtrar o menu com base no papel do usuário
  private filterMenu() {
    if (this.userRole === 'admin') {
      // Se o papel for admin, exiba todos os itens do menu
      this._pagesMenu.set(Menu.pages);
    } else {
      // Se não for admin, remova os itens do menu relacionados a admin
      const filteredMenu = Menu.pages.map(menu => {
        return {
          ...menu,
          items: menu.items.filter(item => item.role !== 'admin') // Filtra os itens que não são admin
        };
      });
      this._pagesMenu.set(filteredMenu);
    }
  }

  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  private isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
