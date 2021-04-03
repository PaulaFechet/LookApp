import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { AddCategoryComponent } from '../add-category/add-category.component';
import {MatDialog,MatDialogConfig, MatDialogRef, } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {AddEntryComponent} from '../add-entry/add-entry.component'
@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

public data: any;
  ngOnInit(): void {

  }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'description', 'type'];
  productForm: FormGroup;

  constructor(private fb:FormBuilder, private _router: Router, public dialog: MatDialog) {}

  onSubmit() {
    console.log(this.productForm.value);
  }

  onCreate() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '70vw',
      maxHeight: '100vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onEdit(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(AddCategoryComponent,dialogConfig);
  }

  onDelete($key){
    if(confirm('Are you sure to delete this record ?')){
    }
  }

  onCreateAddRecord(){
    console.log("am intrat in oncreateaddRecord")
    const dialogReff = this.dialog.open(AddEntryComponent, {
      width: '70vw',
      maxHeight: '100vh',
    });
    dialogReff.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
