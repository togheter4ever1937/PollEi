import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigationbar',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './navigationbar.component.html',
  styleUrl: './navigationbar.component.css',
})
export class NavigationbarComponent {
  isMenuOpen = false;

  openMobileMenu(): void {
    this.isMenuOpen = true;
  }

  closeMobileMenu(): void {
    this.isMenuOpen = false;
  }
}
