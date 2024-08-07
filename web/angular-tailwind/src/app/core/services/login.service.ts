import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from 'src/app/types/login-response.type';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string = environment.BASE_URL + "/api/v1";

  constructor(private httpClient: HttpClient, private toastService: ToastService) { }

  login(email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password }).pipe(
      tap((value) => {
        localStorage.setItem("auth-token", value.access_token);
        localStorage.setItem("username", value.user.name);
        this.toastService.openToast('Logado com sucesso!', 'toast-success');
      })
    )
  }
}