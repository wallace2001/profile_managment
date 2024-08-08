import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from 'src/app/types/login-response.type';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string = environment.BASE_URL + "/api/v1";

  constructor(private httpClient: HttpClient, private router: Router, private userService: UserService, private toastService: ToastService) { }

  login(email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password }).pipe(
      tap((value) => {
        this.userService.setUser({
          id: value.user.id,
          email: value.user.email,
          name: value.user.name,
          lastName: value.user.last_name,
          role: value.user.role,
        });
        localStorage.setItem("auth-token", value.access_token);
        localStorage.setItem("username", value.user.name);
        this.toastService.openToast('Logado com sucesso!', 'toast-success');
        this.router.navigate(['/dashboard/home']);
      })
    )
  }
}