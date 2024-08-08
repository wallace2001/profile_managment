import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role, UserFormatted, UserRequest } from 'src/app/types/user-response';
import { UserService } from 'src/app/core/services/user.service';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { ModalService } from 'src/app/core/services/modal.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    ButtonComponent
  ],
  providers: [
    AuthService
  ],
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.scss'],
})
export class ModalPageComponent implements OnInit {
  public user!: UserFormatted | null;
  public userEdited!: UserFormatted | null;
  public loadingButton: boolean = false;
  public form!: FormGroup;
  public roles!: Role[];
  public submitted = false;
  public isVisible = false;
  public isNew = false;

  constructor(
    public authService: AuthService, 
    public userService: UserService,
    private readonly _formBuilder: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    this.modalService.modal$.subscribe(isVisible => {
      this.isVisible = isVisible;

      if (isVisible) {
        this.resetAndInitializeForm();
      }
    });

    this.userService.user$.subscribe(user => this.user = user);
    this.authService.roles$.subscribe(roles => this.roles = roles.roles);
    this.userService.loading$.subscribe(loading => this.loadingButton = loading);
  }

  private resetAndInitializeForm(): void {
    combineLatest([this.modalService.userEdited$, this.userService.user$, this.modalService.isCreateUser$])
      .subscribe(([userEdited, user, isNew]) => {
        this.isNew = isNew;

        if (isNew) {
          this.userEdited = null;
          this.initializeForm();
        } else if (userEdited?.id) {
          this.initializeForm(userEdited);
        this.userEdited = userEdited;
        } else if (user.id) {
          this.userEdited = null;
          this.initializeForm(user);
        }
      });
  }

  private initializeForm(value?: UserFormatted): void {
    this.form = this._formBuilder.group({
      email: [value?.email || '', [Validators.required, Validators.email]],
      name: [value?.name || '', Validators.required],
      lastName: [value?.lastName || '', Validators.required],
      roles: [value?.role.id || ''],
      password: [''],
    });

    if (this.user && this.user.role.name === 'admin') {
      this.form.get('roles')?.setValidators([Validators.required]);
    }

    if (!value?.id) {
      this.form.get('password')?.setValidators([Validators.required]);
    }

    this.form.get('roles')?.updateValueAndValidity();
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) return;

    const newUser: UserRequest = {
      name: this.form.value.name,
      email: this.form.value.email,
      last_name: this.form.value.lastName,
      role: this.form.value.roles,
      password: this.form.value.password
    };

    if (this.userEdited?.id || this.user?.id) {
      if (!this.isNew) {
        const userId = this.userEdited?.id || this.user?.id!;
        this.userService.updateUser(userId, newUser, () => this.closeModal());
      } else {
        this.userService.addUser(newUser, () => this.closeModal());
      }
    } 
  }

  closeModal(): void {
    this.form.reset();
    this.modalService.closeModal();
  }

  get f() {
    return this.form.controls;
  }
}
