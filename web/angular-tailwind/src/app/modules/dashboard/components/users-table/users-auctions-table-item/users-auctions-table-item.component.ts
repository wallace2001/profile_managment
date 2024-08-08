import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserFormatted } from 'src/app/types/user-response';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalPageComponent } from "../../../../layout/components/modal/modal-page.component";
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { ModalConfirmationComponent } from 'src/app/modules/layout/components/modal-confirmation/modal-confirmation.component';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
    selector: '[users-auctions-table-item]',
    templateUrl: './users-auctions-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule, CurrencyPipe, CommonModule, FormsModule, ReactiveFormsModule, ModalPageComponent, ModalConfirmationComponent, ButtonComponent],
    providers: [
      AuthService
    ],
})
export class UsersAuctionsTableItemComponent implements OnInit {
  public loadingButton: boolean = false;
  @Input() auction = <UserFormatted>{};
  @ViewChild(ModalConfirmationComponent) modalConfirmation!: ModalConfirmationComponent;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
  }

  openModal(user: UserFormatted) {
    this.modalService.openModal();
    this.modalService.setUserEdited(user);
  }

  openModalConfirmation(id: number | null) {
    this.modalConfirmation.openModal();
  }

}
