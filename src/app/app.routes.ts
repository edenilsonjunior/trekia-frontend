import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthLayout } from './pages/layouts/auth-layout/auth-layout';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { MainLayout } from './pages/layouts/main-layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path:'login',
                component: Login,
                pathMatch: 'full'
            },
            {
                path: 'register',
                component: Register,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path:'dashboard',
                component: Dashboard,
                pathMatch: 'full'
            }
        ]
    }
];
