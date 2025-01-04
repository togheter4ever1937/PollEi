import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
  isVisible: boolean = false;

  languageMenu(): void {
    if (!this.isVisible) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  closeLanguageMenu(): void {
    this.isVisible = false;
  }
}
