import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { UserFormatted } from 'src/app/types/user-response';
import { LoadingService } from 'src/app/modules/layout/services/loading.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';
import { UsersAuctionsTableItemComponent } from '../users-auctions-table-item/users-auctions-table-item.component';

@Component({
    selector: 'users-auctions-table',
    templateUrl: './users-auctions-table.component.html',
    standalone: true,
    imports: [NgFor, UsersAuctionsTableItemComponent, CommonModule, HttpClientModule],
    providers: [AuthService],
})
export class UsersAuctionsTableComponent implements OnInit {
  @Input() users: UserFormatted[] = [];

  constructor() {}

  ngOnInit(): void {}
}
