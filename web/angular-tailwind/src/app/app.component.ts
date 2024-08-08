import { Component, NgModule, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './modules/layout/components/loading/loading.component';
import { LoadingService } from './modules/layout/services/loading.service';
import { initFlowbite } from 'flowbite';
import { ToastComponent } from './shared/components/toast/toast.component';
import { IToastStatus, ToastService } from './core/services/toast.service';
import { ModalPageComponent } from './modules/layout/components/modal/modal-page.component';
import { UserService } from './core/services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, RouterOutlet, ResponsiveHelperComponent, CommonModule, HttpClientModule, ToastComponent, LoadingComponent],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'My App';
  public toast!: IToastStatus;

  constructor(public themeService: ThemeService, public loadingService: LoadingService, public toastService: ToastService) {}
  ngOnInit(): void {
    initFlowbite();
    this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
    })
  }
}
