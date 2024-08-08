import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalPageComponent } from '../layout/components/modal/modal-page.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [RouterOutlet, ModalPageComponent, HttpClientModule],
    providers: [HttpClient]
})
export class DashboardComponent implements OnInit {
  
  constructor(private userService: UserService) {
    this.userService.loadUser();
  }

  ngOnInit(): void {}
}
