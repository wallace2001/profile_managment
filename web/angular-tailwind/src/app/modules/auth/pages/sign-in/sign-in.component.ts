import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoginService } from 'src/app/core/services/login.service';
import { MenuService } from 'src/app/modules/layout/services/menu.service';

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
    private readonly _router: Router, 
    private loginService: LoginService,
    private menuService: MenuService
  ) {}

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
      },
      complete: () => {
        this.loading = false;
        this.errorLogin = false;
        this._router.navigate(['/dashboard/home']);
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
