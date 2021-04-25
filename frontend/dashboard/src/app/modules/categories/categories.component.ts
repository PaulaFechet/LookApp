import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { CategoryModel } from 'src/app/shared/models/category'
import { CategoryService } from '../../shared/services/category.service'
import { AddCategoryComponent } from '../add-category/add-category.component'
import { AddRecordComponent } from '../add-record/add-record.component'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public categoryList: CategoryModel[] = [];
  public listData: MatTableDataSource<any>;
  public displayedColumns: string[] = ['title', 'description', 'type'];
  public productForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.populateCategories().subscribe();
    this.categoryService.categories.subscribe(categories => {
      this.categoryList = categories;
    });
  }


  onSubmit(): void {
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

  onEdit(row) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(AddCategoryComponent, dialogConfig);
  }

  onDelete(id: number) {
    if (confirm('Are you sure to delete this record ?')) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }

  onCreateAddRecord() {
    console.log("am intrat in oncreateaddRecord")
    const dialogReff = this.dialog.open(AddRecordComponent, {
      width: '70vw',
      maxHeight: '100vh',
    });
    dialogReff.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
