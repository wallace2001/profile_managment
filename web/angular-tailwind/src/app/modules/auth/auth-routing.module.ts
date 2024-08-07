import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'sign-in', component: SignInComponent, data: { returnUrl: window.location.pathname } },
      { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
