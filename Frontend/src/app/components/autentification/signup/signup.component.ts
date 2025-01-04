import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SignUpService } from '../../../services/signUpService/sign-up.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null, // Add image property here
  };

  confirmPassword = '';
  error = {
    isEmpty: false,
    emptyFields: '',
  };

  isSignIn = false;

  constructor(private signUpService: SignUpService, private router: Router) {}

  createUser() {
    if (!this.user.email || !this.user.name || !this.user.password) {
      this.error.emptyFields = 'Please fill out all the fields!';
      this.error.isEmpty = true;
    } else {
      this.error.isEmpty = false;
      this.error.emptyFields = '';
      if (this.user.password === this.confirmPassword) {
        // Create FormData to send user data and the image
        const formData = new FormData();
        formData.append('name', this.user.name);
        formData.append('email', this.user.email);
        formData.append('password', this.user.password);
        formData.append('image', this.user.image); // Attach the image

        this.signUpService.createUser(formData).subscribe(
          (data) => {
            console.log(data.msg);
            this.isSignIn = true;
            this.user.name = '';
            this.user.email = '';
            this.user.password = '';
            this.confirmPassword = '';
            this.router.navigate(['/verification']);
          },
          (error) => {
            console.log(error.error.msg);
          }
        );
      } else {
        alert('Please confirm your password, check it again!');
      }
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.user.image = file; // Store the selected image in the user object
    }
  }
}
