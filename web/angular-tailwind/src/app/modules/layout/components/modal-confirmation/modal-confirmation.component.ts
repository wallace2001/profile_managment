import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { FlowbiteService } from 'src/app/core/services/flowbite.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role, User, UserFormatted, UserRequest } from 'src/app/types/user-response';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { ButtonComponent } from "../../../../shared/components/button/button.component";

@Component({
  selector: 'app-modal-confirmation',
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
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss'],
})
export class ModalConfirmationComponent implements OnInit, AfterViewInit  {
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
    public userService: UserService,
  ) {}

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.userService.loading$.subscribe(loading => {
      this.loadingButton = loading;
    })

    this.flowbiteService.loadFlowbite(flowbite => {
    });
  }

  onClick() {
    if (this.user.id) {
      this.userService.deleteUser(this.user.id);
    }
  }

  onCloseModal() {
    this.closeModal();
  }

}
