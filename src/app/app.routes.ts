import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthLayout } from './pages/layouts/auth-layout/auth-layout';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { MainLayout } from './pages/layouts/main-layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Travel } from './components/travel/travel';
import { Roadmap } from './components/roadmap/roadmap';
import { authGuardGuard } from './guards/auth-guard-guard';

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
      { path: 'travels', component: Travel, canActivate: [authGuardGuard] },
      { path: 'roadmaps', component: Roadmap, canActivate: [authGuardGuard] }
    ]
  }
];

  