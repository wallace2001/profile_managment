import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, shareReplay, tap } from 'rxjs';
// import { LoadingService } from './loading.service';
import jwt_decode from "jwt-decode";
import { Role, User, UserRequest, UserResponse } from 'src/app/types/user-response';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/modules/layout/services/menu.service';
import { ToastService } from './toast.service';
import { UserDetail } from 'src/app/shared/models/user-detail.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.BASE_URL + "/api/v1";
  users!: User[];
  user: User = {
    id: null,
    name: '',
    email: '',
    last_name: '',
    roles: [
      {
        id: 0,
        name: ''
      }
    ]
  };
  roles!: Role[];
  formData: UserDetail = new UserDetail();

  private authToken: any;
  private userCache$: Observable<UserResponse> | undefined;
  private rolesCache$: Observable<{roles: Role[]}> | undefined;
  private usersCache$: Observable<{users: User[]}> | undefined

  private rolesSubject = new BehaviorSubject<{roles: Role[]}>({roles: []});
  roles$ = this.rolesSubject.asObservable();

  constructor(private httpClient: HttpClient, private router: Router, private menuService: MenuService) {
    this.authToken = localStorage.getItem('auth-token');
    this.getRoles();
  }

  getUser(token?: string): Observable<UserResponse> {
    if (!this.userCache$) {
      this.userCache$ = this.httpClient.get<UserResponse>(`${this.apiUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${token || this.authToken}`
        }
      }).pipe(
        shareReplay(1),
        tap(response => {
          this.user = response.user;
          this.menuService.setUserRole(response.user.roles[0].name);
        }),
        catchError(error => {
          this.userCache$ = undefined;
          localStorage.removeItem('');
          throw error;
        })
      );
    }
    return this.userCache$;
  }

  clearCache() {
    this.userCache$ = undefined;
    this.rolesCache$ = undefined;
  }

  getUsers(token?: string) {
    if (!this.usersCache$) {
      this.usersCache$ = this.httpClient.get<{users: User[]}>(`${this.apiUrl}/admin`, {
        headers: {
          'Authorization': `Bearer ${token || this.authToken}`
        }
      }).pipe(
        shareReplay(1),
        tap(value => {
          this.users = value.users;
        }),
        catchError((err) => {
          throw err;
        })
      );
    }

    return this.usersCache$;
  }

  refreshlist(){
    this.httpClient.get<{users: User[]}>(`${this.apiUrl}/admin`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
    .toPromise()
    .then((res) => {
      if (res?.users) {
        this.users = res.users;
      }
    });
  }

  createUser(user: UserRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/admin`, user, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });
  }

  updateUser(id: number, user: UserRequest): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${this.apiUrl}/admin/${id}`, user, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });
  }

  getRoles() {
    if (!this.authToken) return;
    this.httpClient.get<{roles: Role[]}>(`${this.apiUrl}/roles`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    }).subscribe({
      next: (value) => {
        this.rolesSubject.next(value);
      },
      error(err) {
        throw err;
      },
    } );
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/admin/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });
  }

  updateMyUser(user: User): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${this.apiUrl}/users`, user, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.menuService.setUserRole('');
    this.router.navigate(['/auth/sign-in']);
  }

}
