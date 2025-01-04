import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth-service.service';

@Component({
  selector: 'app-navigationbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css'],
})
export class NavigationbarComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isMenuOpen = false;
  isLogedIn!: boolean;
  userInfo: any;
  url = 'http://localhost:3000/uploads/';

  ngOnInit(): void {}

  openMobileMenu(): void {
    this.isMenuOpen = true;
  }

  closeMobileMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInfo(): any {
    this.isLogedIn = this.authService.isAuthenticated();
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.userInfo = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
