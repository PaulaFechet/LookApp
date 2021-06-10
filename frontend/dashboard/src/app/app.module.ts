import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatRadioModule } from '@angular/material/radio'
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { DefaultModule } from './layouts/default/default.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

import { AddCategoryComponent } from './modules/add-category/add-category.component';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { AddRecordComponent } from './modules/add-record/add-record.component';

import { JwtInterceptor } from '../app/shared/interceptors/jwt.interceptor';
import { CategoryDetailsComponent } from './modules/category-details/category-details.component';
import { DialogBoxComponent } from './modules/dialog-box/dialog-box.component';
import { UpdateCategoryComponent } from './modules/update-category/update-category.component';
import { UpdateRecordComponent } from './modules/update-record/update-record.component';
import { MatSortModule } from '@angular/material/sort';
import { CorrelationComponent } from './modules/correlation/correlation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ColorPickerModule } from 'ngx-color-picker';
import { CategoryGraphPreviewComponent } from './modules/category-graph-preview/category-graph-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    AddRecordComponent,
    AddCategoryComponent,
    CategoryDetailsComponent,
    DialogBoxComponent,
    UpdateCategoryComponent,
    UpdateRecordComponent,
    CorrelationComponent,
    CategoryGraphPreviewComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    DefaultModule,
    RouterModule,
    MatToolbarModule,
    AuthenticationModule,
    MatIconModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDialogModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    ColorPickerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddCategoryComponent]
})
export class AppModule { }
