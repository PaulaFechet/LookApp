import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/authentication/login/login.component';
import { AddFormComponent } from './modules/add-form/add-form.component';
import { AddEntryComponent } from './modules/add-entry/add-entry.component';
import { AddCategoryComponent } from './modules/add-category/add-category.component';
import { SignupComponent } from './modules/authentication/signup/signup.component';
import { AuthGuard } from '../app/shared/helpers/auth.guard';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,

  },
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'dashboard',
      component: DashboardComponent,

    }, {
      path: 'add_category',
      component: AddFormComponent,
    }, {
      path: 'add-entry',
      component: AddEntryComponent,
    }, {
      path: 'add_categoryy',
      component: AddCategoryComponent,
    }]

  },
  {
    path : '**',
    component: LoginComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
