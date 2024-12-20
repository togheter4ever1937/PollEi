import { HomepageComponent } from './components/homepage/homepage.component';
import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationbarComponent } from './components/navigationbar/navigationbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Frontend';
}
