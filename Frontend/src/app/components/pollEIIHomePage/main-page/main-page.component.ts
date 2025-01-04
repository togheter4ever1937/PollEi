import { log } from 'node:console';
import { AuthService } from '../../../services/Auth/auth-service.service';
import { Component } from '@angular/core';
import { NavigationbarComponent } from '../../navigationbar/navigationbar.component';

@Component({
  selector: 'app-main-page',
  imports: [NavigationbarComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  user: any;
  constructor(private authService: AuthService) {}

  getUserInfo(): any {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.user = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
