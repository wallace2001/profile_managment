import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HomeHeaderComponent } from '../../components/home-header/home-header.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [
        NgFor,
        HomeHeaderComponent
    ],
})
export class HomeComponent {

}
