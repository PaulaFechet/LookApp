import { UpdateCategoryComponent } from './../update-category/update-category.component';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { CategoryModel } from 'src/app/shared/models/category'
import { CategoryService } from '../../shared/services/category.service'
import { AddCategoryComponent } from '../add-category/add-category.component'
import { AddRecordComponent } from '../add-record/add-record.component'
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public categoryList: CategoryModel[] = [];
  public searchText: string = '';
  public filteredCategoryList: CategoryModel[] = [];
  disableScrollDown = false
  public element: any;
  constructor(
    public router: Router,
    private readonly modal: MatDialog,
    private readonly categoryService: CategoryService) { }
  @ViewChild('scroll', { static: true }) scroll: any;

  ngOnInit(): void {
    this.categoryService.populateCategories().subscribe(categorie$ => {
      categorie$.subscribe(categories => {
        this.categoryList = categories;
        this.filteredCategoryList = categories;
      });
    });

  }

  ngAfterViewInit() {
    this.element = document.getElementById("categories");
    this.element.scrollIntoView(false); // Bottom
  }

  public scrollToBottom() {
    this.element.scrollIntoView(false); // Bottom
  }

  onCreateCategory(): void {
    let obj = {action: ''};
    obj.action = "Create";
    const createModal = this.modal.open(AddCategoryComponent, {
      width: '600px',
      minWidth: '600px',
      maxHeight: '100vh',
      data: obj
    });
    createModal.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'Create') {
        this.scrollToBottom();
      }

    });
  }

  onEdit(category: CategoryModel): void {
    this.modal.open(UpdateCategoryComponent, {
      width: '600px',
      minWidth: '600px',
      maxHeight: '100vh',
      disableClose: true,
      autoFocus: true,
      data: category
    });
  }


  onDeleteCategory(obj: any): void {
    obj.action = "Delete";
    const modalRef = this.modal.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    modalRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.categoryService.deleteCategory(obj.id).subscribe();
      }
    });
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
    if (this.searchText == '') {
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
