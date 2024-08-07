import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth.service';
import { User, UserFormatted } from 'src/app/types/user-response';
import { LoadingService } from '../../../services/loading.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule, CommonModule],
  providers: [AuthService],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  isAdmin!: boolean;
  user: UserFormatted = {
    id: 0,
      name: '',
      email: '',
      role: {
        id: 0,
        name: ''
      },
      createdAt: '',
      emailVerified: false,
      lastName: '',
      updatedAt: '',
  };
  public profileMenu = [
    {
      title: 'Log out',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '/auth',
      onclick: () => {
        this.authService.logout();
      }
    },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];

  constructor(public themeService: ThemeService, private authService: AuthService, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.authService.getUser().pipe(
      tap(response => {
        this.user = {
          name: response.user.name,
          email: response.user.email,
          id: response.user.id,
          createdAt: response.user.created_at,
          updatedAt: response.user.updated_at,
          emailVerified: response.user.email_verified_at,
          lastName: response.user.last_name,
          role: response.user.roles[0],
        };
        this.isAdmin = response.user.roles[0].name === 'admin';
        this.loadingService.setLoading(false);
      }),
      catchError((error) => {
        console.error('Error fetching user data');
        this.loadingService.setLoading(false);
        throw error;
      })
    ).subscribe()
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }
}
