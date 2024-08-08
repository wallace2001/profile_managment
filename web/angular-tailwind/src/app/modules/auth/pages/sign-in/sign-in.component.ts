import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoginService } from 'src/app/core/services/login.service';
import { MenuService } from 'src/app/modules/layout/services/menu.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
  providers: [
    LoginService
  ]
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  loading = false;
  errorLogin = false;

  constructor(
    private readonly _formBuilder: FormBuilder, 
    private _router: Router, 
    private loginService: LoginService,
    private menuService: MenuService,
  ) {
    if (localStorage.getItem('auth-token')) {
      this._router.navigate(['/dashboard/home']);
    }
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    const { email, password } = this.form.value;

    this.loginService.login(email, password).subscribe({
      next: (response) => {
        this.menuService.setUserRole(response.user.role.name);
        localStorage.setItem("auth-token", response.access_token);
        localStorage.setItem("username", response.user.name);
      },
      complete: () => {
        this.loading = false;
        this.errorLogin = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorLogin = true;
      }
    })

    if (this.form.invalid) {
      return;
    }
  }
}
