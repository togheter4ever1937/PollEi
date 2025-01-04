import { FooterComponent } from '../home/footer/footer.component';
import { GetstartedComponent } from '../home/getstarted/getstarted.component';
import { Component } from '@angular/core';
import { NavigationbarComponent } from '../navigationbar/navigationbar.component';
import { HeroComponent } from '../home/hero/hero.component';
import { FeaturesComponent } from '../home/features/features.component';

@Component({
    selector: 'app-homepage',
    imports: [
        NavigationbarComponent,
        HeroComponent,
        FeaturesComponent,
        GetstartedComponent,
        FooterComponent,
    ],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {}
