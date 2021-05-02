import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Router } from '@angular/router'
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

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.populateCategories().subscribe(categories$ => {
      categories$.subscribe(categories => {
        this.categoryList = categories;
      });
    });
  }

  onCreateCategory() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '70vw',
      maxHeight: '100vh',
    });

    dialogRef.afterClosed().subscribe();
  }

  onEdit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(AddCategoryComponent, dialogConfig);
  }

  onDeleteCategory(id: number) {
    if (confirm('Are you sure to delete this record ?')) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }

  onAddRecord(category: CategoryModel) {
    const dialogReff = this.dialog.open(AddRecordComponent, {
      width: '70vw',
      maxHeight: '100vh',
      data: category
    });
    dialogReff.afterClosed().subscribe();
  }
}
