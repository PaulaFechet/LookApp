import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryModel } from '../models/category';
import { CategoryRepositoryService } from './../repositories/category-repository.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly categories: BehaviorSubject<CategoryModel[]>;

  constructor(private categoryRepositoryService: CategoryRepositoryService) {
    this.categories = new BehaviorSubject<CategoryModel[]>([]);
  }

  populateCategories(): Observable<Observable<CategoryModel[]>> {
    return this.categoryRepositoryService.getAllCategories()
      .pipe(
        map(categories => {
          this.categories.next(categories);
          return this.categories.asObservable();
        })
      );
  }

  getById(categoryId: number): Observable<CategoryModel> {
    let category = this.categories.value.find(category => category.id === categoryId);
    if (!category) {
      return this.categoryRepositoryService.getById(categoryId);
    }
    return of(category);
  }

  addCategory(categoryModel: CategoryModel): Observable<void> {
    return this.categoryRepositoryService.addCategory(categoryModel)
      .pipe(
        map(addedCategory => {
          this.categories.next([...this.categories.value, addedCategory]);
        })
      );
  }

  updateCategory(categoryId: number, categoryModel: CategoryModel): Observable<void> {
    let updatedCategoryList = [];
    return this.categoryRepositoryService.updateCategory(categoryId, categoryModel)
      .pipe(
        map(updatedCategory => {
          this.categories.value.forEach(element => {
            if (element.id == updatedCategory.id) {
              updatedCategoryList.push(updatedCategory)
            } else {
              updatedCategoryList.push(element)
            }
          });
          this.categories.next(updatedCategoryList);
        }
        )
      )
  }

  deleteCategory(id: number): Observable<void> {
    return this.categoryRepositoryService.deleteCategory(id)
      .pipe(
        map(() => {
          this.categories.next(this.categories.value.filter(c => c.id !== id));
        })
      );
  }
}
