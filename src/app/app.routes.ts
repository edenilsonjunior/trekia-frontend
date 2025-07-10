import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthLayout } from './pages/auth-layout/auth-layout';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

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
    }
];
