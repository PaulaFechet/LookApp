import { UpdateCategoryComponent } from './../update-category/update-category.component';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { CategoryModel } from 'src/app/shared/models/category'
import { CategoryService } from '../../shared/services/category.service'
import { AddCategoryComponent } from '../add-category/add-category.component'
import { AddRecordComponent } from '../add-record/add-record.component'
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly componentDestroyed$: Subject<boolean> = new Subject();

  public categoryList: CategoryModel[] = [];
  public searchText: string = '';
  public filteredCategoryList: CategoryModel[] = [];
  public disableScrollDown = false
  public element: any;

  @ViewChild('scroll', { static: true }) scroll: any;

  constructor(
    public readonly router: Router,
    private readonly modal: MatDialog,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    this.categoryService.populateCategories()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(categorie$ => {

        categorie$
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe(categories => {

            this.categoryList = categories;
            this.filteredCategoryList = categories;
          });
      });
  }

  ngAfterViewInit(): void {
    this.element = document.getElementById("categories");
    this.element.scrollIntoView(false); // Bottom
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  public scrollToBottom() {
    this.element.scrollIntoView(false); // Bottom
  }

  onCreateCategory(): void {
    let obj = { action: '' };
    obj.action = "Create";
    const createModal = this.modal.open(AddCategoryComponent, {
      width: '600px',
      minWidth: '600px',
      maxHeight: '100vh',
      data: obj
    });

    createModal.afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(result => {

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

    modalRef.afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(result => {

        if (result.event == 'Delete') {
          this.categoryService.deleteCategory(obj.id)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe();
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
    if (this.searchText == '') {
      this.categoryService.populateCategories()
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(categorie$ => {

          categorie$
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(categories => {

              this.categoryList = categories;
              this.filteredCategoryList = categories;
            });
        });
    }

    this.filteredCategoryList = this.categoryList.filter(
      c => c.title.toLowerCase().includes(this.searchText.toLowerCase()));
  }
}
