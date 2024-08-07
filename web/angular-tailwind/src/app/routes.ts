import { Routes } from '@angular/router';
import { LayoutModule } from './modules/layout/layout.module';
import { AuthModule } from './modules/auth/auth.module';
import { ErrorModule } from './modules/error/error.module';

export const routes: Routes = [
    {
        path: "",
        component: LayoutModule
    },
    {
        path: "auth",
        component: AuthModule
    },
    {
        path: "errors",
        component: ErrorModule,
    },
    {
        path: "**",
        redirectTo: 'errors/404'
    }
];
