import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SignUpService } from '../../../services/signUpService/sign-up.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { log } from 'node:console';

@Component({
  selector: 'app-verification-code',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css'],
})
export class VerificationCodeComponent {
  code!: string;
  isEmpty = false;

  constructor(private signUpService: SignUpService, private router: Router) {}

  accountVerification() {
    if (!this.code) {
      this.isEmpty = true;
      console.log('Please enter your validation code.');
    } else {
      this.isEmpty = false;
      this.signUpService.codeVerification(this.code).subscribe(
        (data) => {
          console.log(data.msg);
          this.router.navigate(['/login']);
        },
        (err) => {
          alert(err.error.msg);
        }
      );
    }
  }
}
