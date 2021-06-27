import { UpdateCategoryComponent } from './../update-category/update-category.component';
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
  public searchText: string = '';
  public filteredCategoryList: CategoryModel[] = [];

  constructor(
    public router: Router,
    private readonly modal: MatDialog,
    private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.populateCategories().subscribe(categorie$ => {
      categorie$.subscribe(categories => {
        this.categoryList = categories;
        this.filteredCategoryList = categories;
      });
    });
  }

  onCreateCategory(): void {
    this.modal.open(AddCategoryComponent, {
      width: '600px',
      minWidth: '600px',
      maxHeight: '100vh',
    });
  }

  onEdit(category: CategoryModel): void {
    this.modal.open(UpdateCategoryComponent, {
      width: '60%',
      disableClose: true,
      autoFocus: true,
      data: category
    });
  }

  onDeleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }

  onAddRecord(category: CategoryModel): void {
    this.modal.open(AddRecordComponent, {
      width: '400px',
      maxHeight: '100vh',
      data: category
    });
  }

  filterCategories(x) {
    this.searchText = x.target.value + '';
    console.log(this.searchText);
    if(this.searchText == '')
    {
      this.categoryService.populateCategories().subscribe(categorie$ => {
        categorie$.subscribe(categories => {
          this.categoryList = categories;
          this.filteredCategoryList = categories;
        });
      });
    }
    this.filteredCategoryList = this.categoryList.filter(c => c.title.toLowerCase().includes(this.searchText.toLowerCase()));
    console.log(this.filteredCategoryList);
  }
}
