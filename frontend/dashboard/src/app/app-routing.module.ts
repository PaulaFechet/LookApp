import { ChangePasswordComponent } from './modules/authentication/change-password/change-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/authentication/login/login.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { AddCategoryComponent } from './modules/add-category/add-category.component';
import { SignupComponent } from './modules/authentication/signup/signup.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { CategoryDetailsComponent } from './modules/category-details/category-details.component';
import { CorrelationComponent } from './modules/correlation/correlation.component';

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
    path: 'changePassword',
    component: ChangePasswordComponent
  },
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'categories/:id',
        component: CategoryDetailsComponent
      },
      {
        path: 'add_category',
        component: AddCategoryComponent,
      },
      {
        path: 'correlation',
        component: CorrelationComponent
      }
    ]
  },
  {
    path: '**',
    component: LoginComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
