import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { LoadingService } from '../layout/services/loading.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: true,
    imports: [AngularSvgIconModule, RouterOutlet, NgIf],
})
export class AuthComponent implements OnInit {
  isLoading = true;
  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(value => this.isLoading = value);
  }

  ngOnInit(): void {}
}
