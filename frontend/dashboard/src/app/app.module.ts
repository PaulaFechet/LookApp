import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {DefaultModule} from './layouts/default/default.module';
import { RouterModule } from '@angular/router';
import {LoginComponent} from './modules/authentication/login/login.component'
import {AuthenticationModule} from './modules/authentication/authentication.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddFormComponent } from './modules/add-form/add-form.component';
import { AddEntryComponent } from './modules/add-entry/add-entry.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { AddCategoryComponent } from './modules/add-category/add-category.component'
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatRadioModule} from '@angular/material/radio'
import { MatNativeDateModule } from '@angular/material/core';
import {  MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    AddFormComponent,
    AddEntryComponent,
    AddCategoryComponent,


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
    MatTableModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddCategoryComponent]
})
export class AppModule { }
