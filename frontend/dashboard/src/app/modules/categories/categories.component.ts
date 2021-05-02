import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
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
    private readonly modal: MatDialog,
    private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.populateCategories().subscribe(categories$ => {
      categories$.subscribe(categories => {
        this.categoryList = categories;
      });
    });
  }

  onCreateCategory(): void {
    this.modal.open(AddCategoryComponent, {
      width: '70vw',
      maxHeight: '100vh'
    });
  }

  onEdit(): void {
    this.modal.open(AddCategoryComponent, {
      width: '60%',
      disableClose: true,
      autoFocus: true
    });
  }

  onDeleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }

  onAddRecord(category: CategoryModel): void {
    this.modal.open(AddRecordComponent, {
      width: '70vw',
      maxHeight: '100vh',
      data: category
    });
  }
}
