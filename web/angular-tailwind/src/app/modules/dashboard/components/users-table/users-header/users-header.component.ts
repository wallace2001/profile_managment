import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalPageComponent } from 'src/app/modules/layout/components/modal/modal-page.component';

@Component({
    selector: 'app-users-header',
    templateUrl: './users-header.component.html',
    imports: [ModalPageComponent],
    standalone: true,
})
export class UsersHeaderComponent implements OnInit {
  @ViewChild(ModalPageComponent)
  modal!: ModalPageComponent;
  constructor() {}

  ngOnInit(): void {}
}
