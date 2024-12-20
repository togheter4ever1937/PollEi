import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SignupComponent } from './components/autentification/signup/signup.component';
import { LoginComponent } from './components/autentification/login/login.component';
import { TestComponent } from './components/test/test.component';

export const routes: Routes = [
  {
    path: '',
    // component: HomepageComponent,
    component: TestComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
