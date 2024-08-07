import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { IToastStatus, ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    standalone: true,
    imports: [NgIf],
})
export class ToastComponent implements OnInit {
  public toast!: IToastStatus;
  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
    })
  }
}
