import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.userService.loadUser();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.user$.pipe(
      map(response => {
        const roles = response.role;
        if (roles.name.includes('admin')) {
          return true;
        } else if (roles.name.includes('user')) {
          this.router.navigate(['/dashboard/home']);
          return true;
        } else {
          this.router.navigate(['/auth']);
          return true;
        }
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/auth']));
      })
    );
  }
}