import { Component, OnInit } from '@angular/core';
import { UserFormatted } from 'src/app/types/user-response';
import { UsersHeaderComponent } from '../../components/users-table/users-header/users-header.component';
import { UsersAuctionsTableComponent } from '../../components/users-table/users-auctions-table/users-auctions-table.component';
import { UsersAuctionsTableItemComponent } from '../../components/users-table/users-auctions-table-item/users-auctions-table-item.component';
import { LoadingService } from 'src/app/modules/layout/services/loading.service';
import { UserService } from 'src/app/core/services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    standalone: true,
    imports: [
        UsersHeaderComponent,
        UsersAuctionsTableComponent,
        UsersAuctionsTableItemComponent,
        CommonModule,
        HttpClientModule
    ],
})
export class UsersComponent implements OnInit {
  public activeAuction: UserFormatted[] = [];

  constructor(private loadingService: LoadingService, private userService: UserService) {
    this.userService.loadUsers();
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.userService.users$.subscribe((users) => {
      this.activeAuction = users;
      this.loadingService.setLoading(false);
    });
  }
}
