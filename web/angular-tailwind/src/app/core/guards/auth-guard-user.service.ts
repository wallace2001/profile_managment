import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserResponse } from 'src/app/types/user-response';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardUser implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private loginService: LoginService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authToken = localStorage.getItem('auth-token');

    if (!authToken) {
      return this.router.navigate(['/auth']);
    }

    return this.authService.getUser(authToken).pipe(
      map(response => {

        const roles = response.user.roles;
        
        if (roles[0].name.includes('user') || roles[0].name.includes('admin')) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return true;
        }
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/auth']));
      })
    )
  }
}