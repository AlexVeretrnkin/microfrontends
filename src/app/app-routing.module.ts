import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RoutesEnum } from './routes.enum';
import { AuthGuard } from '@base-core';

const routes: Routes = [
  {
    path: RoutesEnum.login,
    component: LoginComponent,
  },
  {
    path: `${RoutesEnum.register}/:${RoutesEnum.registerSecretKey}`,
    component: RegisterComponent,
  },
  {
    path: RoutesEnum.portal,
    loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule),
    canLoad: [AuthGuard]
  },
  {path: '**', redirectTo: 'portal'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
