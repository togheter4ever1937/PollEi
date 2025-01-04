import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/Auth/auth-service.service';
import { loginService } from '../../../services/loginService/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email!: string;
  password!: string;

  constructor(
    private route: Router,
    private authService: AuthService,
    private loginService: loginService
  ) {}

  login() {
    const user = {
      email: this.email,
      password: this.password,
    };

    this.loginService.login(this.email, this.password).subscribe(
      (data: any) => {
        const token = data.login_token;
        if (token) {
          this.authService.login(token); // Save the token to localStorage
          this.route.navigate(['/home']);
        } else {
          alert('Invalid login token received!');
        }
      },
      (error: any) => {
        alert(error.error?.msg || 'Login failed. Please try again.');
      }
    );
  }
}
