import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FlowbiteService } from 'src/app/core/services/flowbite.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role, UserFormatted, UserRequest } from 'src/app/types/user-response';
import { UserService } from 'src/app/core/services/user.service';
import { ButtonComponent } from "../../../../shared/components/button/button.component";

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
export class ModalPageComponent implements OnInit, AfterViewInit  {
  @Input() user: UserFormatted = {
    id: null,
    email: '',
    name: '',
    lastName: '',
    role: {
      id: 0,
      name: ''
    }
  }; 
  public loadingButton: boolean = false;
  form!: FormGroup;
  roles!: Role[];
  submitted = false;
  public isVisible = false;

  constructor(
    private flowbiteService: FlowbiteService, 
    public authService: AuthService, 
    public userService: UserService,
    private readonly _formBuilder: FormBuilder,
  ) {
    
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      name: [this.user?.name || '', Validators.required],
      lastName: [this.user?.lastName || '', Validators.required],
      roles: [this.user?.role.id || '', Validators.required],
      password: [''],
    });


    this.authService.roles$.subscribe(value => {
      this.roles = value.roles;
    });

    this.userService.loading$.subscribe(loading => {
      this.loadingButton = loading;
    })

    if (!this.user?.id) {
      this.form.get('password')?.setValidators([Validators.required]);
    }

      this.form.get('password')?.updateValueAndValidity();

    this.flowbiteService.loadFlowbite(flowbite => {
    });
  }
  
  get f() {
    return this.form.controls;
  }

  onCloseModal() {
    this.closeModal();
  }

  onSubmit() {
    this.submitted = true;
    const { 
      name, 
      lastName,
      email,
      roles,
      password
     } = this.form.value;


     if (this.form.invalid) {
      return;
    }

     const newUser = {
      name,
      email,
      last_name: lastName,
      role: roles,
      password
     } as UserRequest;

     if (!this.user.id) {
      this.userService.addUser(newUser, () => this.onCloseModal());
     } else {
      this.userService.updateUser(this.user.id, newUser, () => this.onCloseModal());
     }
  }

}
