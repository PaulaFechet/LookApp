import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import {LoginComponent} from './modules/authentication/login/login.component'
import {AddFormComponent} from './modules/add-form/add-form.component'
import {AddEntryComponent} from './modules/add-entry/add-entry.component'
import {AddCategoryComponent} from './modules/add-category/add-category.component'
const routes: Routes = [
  {
    path :'',
    component: DefaultComponent,
    children : [{
      path: 'dashboard',
      component: DashboardComponent
    }, {
      path: 'posts',
      component: PostsComponent
    },{
      path:'add_category',
      component: AddFormComponent
    },{
      path: 'add-entry',
      component:AddEntryComponent
    },{
      path: 'add_categoryy',
      component:AddCategoryComponent
    }]

  },
  {
    path:'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
