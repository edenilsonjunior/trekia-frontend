import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthLayout } from './pages/layouts/auth-layout/auth-layout';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { MainLayout } from './pages/layouts/main-layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Trip } from './components/trip/trip';
import { authGuardGuard } from './guards/auth-guard-guard';
import { Schedule } from './components/schedule/schedule';
import { TripDetail } from './components/trip-detail/trip-detail';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [authGuardGuard] },
      { path: 'trips', component: Trip, canActivate: [authGuardGuard] },
      { path: 'schedule', component: Schedule, canActivate: [authGuardGuard] },
      { path: 'trips/:id', component: TripDetail, canActivate: [authGuardGuard] }
    ]
  }
];

  