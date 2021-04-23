import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { AddCategoryComponent } from '../add-category/add-category.component'
import { MatDialog, MatDialogConfig, MatDialogRef, } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { AddEntryComponent } from '../add-entry/add-entry.component'

import { CategoryService } from '../../shared/services/category.service'


@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  public data: any;
  public categoryList: any[] = [];


  ngOnInit(): void {
    this.fetchCategories();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'description', 'type'];
  productForm: FormGroup;

  constructor(private fb: FormBuilder,
    private _router: Router,
    public dialog: MatDialog,
    public categoryService: CategoryService) { }

  onSubmit() {
    console.log(this.productForm.value);
  }

  fetchCategories(){
    this.categoryService.getAllCategories().subscribe((data) => {
      data.forEach(element => {
        this.categoryList.push(element);
        console.log(element);
      });
    })
    console.log(this.categoryList);
  }

  onCreate() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '70vw',
      maxHeight: '100vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.categoryList = [];
      this.fetchCategories();
    });
  }

  onEdit(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(AddCategoryComponent, dialogConfig);
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.categoryService.deleteCategory(id).subscribe(res=>{
        this.categoryList = [];
        this.fetchCategories();
        console.log(res);
        console.log("succes stergere!")
      }, (error =>{
        console.log(error);
      }))
    }
  }



  onCreateAddRecord() {
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
