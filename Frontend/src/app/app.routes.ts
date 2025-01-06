import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SignupComponent } from './components/autentification/signup/signup.component';
import { LoginComponent } from './components/autentification/login/login.component';
import { CreatePollComponent } from './components/pollEIIHomePage/create-poll/create-poll.component';
import { VerificationCodeComponent } from './components/autentification/verification-code/verification-code.component';
import { MainPageComponent } from './components/pollEIIHomePage/main-page/main-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verification',
    component: VerificationCodeComponent,
  },
  {
    path: 'home',
    component: MainPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create-poll',
    component: CreatePollComponent,
    canActivate: [authGuard],
  },
];
